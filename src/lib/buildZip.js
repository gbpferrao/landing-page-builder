import { landingCss } from "../preview/exportHtml.jsx";
import { exportHtml } from "../preview/exportHtml.jsx";
import { getManagedObjectUrlFile } from "./objectUrls.js";

const textEncoder = new TextEncoder();

export async function buildLandingZip(project) {
  const files = [];
  const uploadEntries = collectUploadedAssets(project);
  const html = rewriteHtmlAssetPaths(exportHtml(project, { inlineCss: false }), uploadEntries);

  files.push({ path: "index.html", data: textEncoder.encode(html) });
  files.push({ path: "styles.css", data: textEncoder.encode(landingCss) });

  const assetEntries = collectProjectAssets(project);
  for (const entry of assetEntries) {
    const data = await fetchBytes(entry.url);
    if (data) files.push({ path: entry.zipPath, data });
  }
  for (const entry of uploadEntries) {
    files.push({ path: entry.zipPath, data: new Uint8Array(await entry.file.arrayBuffer()) });
  }

  return new Blob([writeZip(files)], { type: "application/zip" });
}

export async function downloadLandingZip(project, fileName = "landing-page.zip") {
  const blob = await buildLandingZip(project);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function collectProjectAssets(project) {
  const values = [];
  collectStrings(project, values);

  const seen = new Set();
  return values
    .filter((value) => !value.startsWith("blob:"))
    .filter(isAssetReference)
    .map(assetEntry)
    .filter(Boolean)
    .filter((entry) => {
      if (seen.has(entry.zipPath)) return false;
      seen.add(entry.zipPath);
      return true;
    });
}

function collectStrings(value, output) {
  if (typeof value === "string") {
    output.push(value);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectStrings(item, output));
    return;
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectStrings(item, output));
  }
}

function isAssetReference(value) {
  if (/^(https?:|data:|blob:)/.test(value)) return false;
  return /\.(png|jpe?g|webp|svg)$/i.test(value);
}

function assetEntry(value) {
  const normalized = value.replace(/\\/g, "/").replace(/^\/+/, "");
  if (normalized.startsWith("assets/")) {
    return { url: normalized, zipPath: normalized };
  }

  return { url: `assets/${normalized}`, zipPath: `assets/${normalized}` };
}

function collectUploadedAssets(project) {
  const values = [];
  collectStrings(project, values);
  const entriesByUrl = new Map();
  const usedZipPaths = new Set();

  values
    .filter((value) => value.startsWith("blob:"))
    .forEach((url, index) => {
      if (entriesByUrl.has(url)) return;

      const file = getManagedObjectUrlFile(url);
      if (!file) return;

      const name = sanitizeFileName(file.name || `upload-${index + 1}.png`);
      const zipPath = makeUniqueUploadPath(name, usedZipPaths);
      const entry = { url, file, zipPath };

      entriesByUrl.set(url, entry);
      usedZipPaths.add(zipPath);
    });

  return Array.from(entriesByUrl.values());
}

function rewriteHtmlAssetPaths(html, uploadEntries = []) {
  let nextHtml = html
    .replace(/%20/g, " ");
  uploadEntries.forEach((entry) => {
    nextHtml = nextHtml.split(entry.url).join(entry.zipPath);
  });
  return nextHtml;
}

function sanitizeFileName(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "upload.png";
}

function makeUniqueUploadPath(fileName, usedZipPaths) {
  const safeName = fileName || "upload.png";
  const dotIndex = safeName.lastIndexOf(".");
  const stem = dotIndex > 0 ? safeName.slice(0, dotIndex) : safeName;
  const extension = dotIndex > 0 ? safeName.slice(dotIndex) : "";
  let zipPath = `assets/uploads/${safeName}`;
  let suffix = 2;

  while (usedZipPaths.has(zipPath)) {
    zipPath = `assets/uploads/${stem}-${suffix}${extension}`;
    suffix += 1;
  }

  return zipPath;
}

async function fetchBytes(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return new Uint8Array(await response.arrayBuffer());
  } catch {
    return null;
  }
}

function writeZip(files) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  files.forEach((file) => {
    const name = textEncoder.encode(file.path.replace(/\\/g, "/"));
    const data = file.data instanceof Uint8Array ? file.data : new Uint8Array(file.data);
    const crc = crc32(data);
    const localHeader = makeLocalHeader(name, data, crc);
    localParts.push(localHeader, data);
    centralParts.push(makeCentralHeader(name, data, crc, offset));
    offset += localHeader.byteLength + data.byteLength;
  });

  const centralSize = centralParts.reduce((sum, part) => sum + part.byteLength, 0);
  const centralOffset = offset;
  const end = makeEndRecord(files.length, centralSize, centralOffset);
  return new Blob([...localParts, ...centralParts, end]);
}

function makeLocalHeader(name, data, crc) {
  const buffer = new ArrayBuffer(30 + name.byteLength);
  const view = new DataView(buffer);
  view.setUint32(0, 0x04034b50, true);
  view.setUint16(4, 20, true);
  view.setUint16(6, 0, true);
  view.setUint16(8, 0, true);
  view.setUint16(10, 0, true);
  view.setUint16(12, 0, true);
  view.setUint32(14, crc, true);
  view.setUint32(18, data.byteLength, true);
  view.setUint32(22, data.byteLength, true);
  view.setUint16(26, name.byteLength, true);
  view.setUint16(28, 0, true);
  new Uint8Array(buffer, 30).set(name);
  return new Uint8Array(buffer);
}

function makeCentralHeader(name, data, crc, offset) {
  const buffer = new ArrayBuffer(46 + name.byteLength);
  const view = new DataView(buffer);
  view.setUint32(0, 0x02014b50, true);
  view.setUint16(4, 20, true);
  view.setUint16(6, 20, true);
  view.setUint16(8, 0, true);
  view.setUint16(10, 0, true);
  view.setUint16(12, 0, true);
  view.setUint16(14, 0, true);
  view.setUint32(16, crc, true);
  view.setUint32(20, data.byteLength, true);
  view.setUint32(24, data.byteLength, true);
  view.setUint16(28, name.byteLength, true);
  view.setUint16(30, 0, true);
  view.setUint16(32, 0, true);
  view.setUint16(34, 0, true);
  view.setUint16(36, 0, true);
  view.setUint32(38, 0, true);
  view.setUint32(42, offset, true);
  new Uint8Array(buffer, 46).set(name);
  return new Uint8Array(buffer);
}

function makeEndRecord(count, centralSize, centralOffset) {
  const buffer = new ArrayBuffer(22);
  const view = new DataView(buffer);
  view.setUint32(0, 0x06054b50, true);
  view.setUint16(4, 0, true);
  view.setUint16(6, 0, true);
  view.setUint16(8, count, true);
  view.setUint16(10, count, true);
  view.setUint32(12, centralSize, true);
  view.setUint32(16, centralOffset, true);
  view.setUint16(20, 0, true);
  return new Uint8Array(buffer);
}

function crc32(data) {
  let crc = -1;
  for (let index = 0; index < data.length; index += 1) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ data[index]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

export default buildLandingZip;
