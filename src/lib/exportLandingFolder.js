import { landingCss } from "../preview/exportHtml.jsx";
import { exportHtml } from "../preview/exportHtml.jsx";
import { getAssetPreviewUrl, getManagedObjectUrlFile, getPersistedAssetBlob } from "./objectUrls.js";
import { getAsset, getAssetIdFromRef, isIndexedDbAssetRef } from "./projectStore.js";

const textEncoder = new TextEncoder();

export async function exportLandingFolder(project, folderName = "landing-page") {
  if (!window.showDirectoryPicker) {
    throw new Error("Seu navegador nao permite salvar pastas diretamente. Use Chrome ou Edge atualizado.");
  }

  const rootHandle = await window.showDirectoryPicker({ mode: "readwrite" });
  const landingHandle = await rootHandle.getDirectoryHandle(sanitizeFolderName(folderName), { create: true });
  const files = await buildLandingFiles(project);

  for (const file of files) {
    await writeNestedFile(landingHandle, file.path, file.data);
  }
}

export async function buildLandingFiles(project) {
  const files = [];
  const uploadEntries = collectUploadedAssets(project);
  const persistedAssetEntries = await collectPersistedAssets(project);
  const html = rewriteHtmlAssetPaths(exportHtml(project, { inlineCss: false }), [...uploadEntries, ...persistedAssetEntries]);

  files.push({ path: "index.html", data: textEncoder.encode(html) });
  files.push({ path: "styles.css", data: textEncoder.encode(landingCss) });

  const assetEntries = collectProjectAssets(project);
  for (const entry of assetEntries) {
    const data = await fetchBytes(entry.url);
    if (data) files.push({ path: entry.path, data });
  }

  for (const entry of uploadEntries) {
    files.push({ path: entry.path, data: new Uint8Array(await entry.file.arrayBuffer()) });
  }
  for (const entry of persistedAssetEntries) {
    files.push({ path: entry.path, data: new Uint8Array(await entry.blob.arrayBuffer()) });
  }

  return files;
}

export function collectProjectAssets(project) {
  const values = [];
  collectStrings(project, values);

  const seen = new Set();
  return values
    .filter((value) => !value.startsWith("blob:"))
    .filter((value) => !isIndexedDbAssetRef(value))
    .filter(isAssetReference)
    .map(assetEntry)
    .filter(Boolean)
    .filter((entry) => {
      if (seen.has(entry.path)) return false;
      seen.add(entry.path);
      return true;
    });
}

export function sanitizeFolderName(value) {
  return sanitizeFileName(value || "landing-page")
    .replace(/\.[^.]+$/, "")
    || "landing-page";
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
    return { url: normalized, path: normalized };
  }

  return { url: `assets/${normalized}`, path: `assets/${normalized}` };
}

async function collectPersistedAssets(project) {
  const values = [];
  collectStrings(project, values);
  const entriesByRef = new Map();
  const usedPaths = new Set();

  for (const ref of values.filter(isIndexedDbAssetRef)) {
    if (entriesByRef.has(ref)) continue;

    const assetId = getAssetIdFromRef(ref);
    const asset = await getAsset(assetId);
    const blob = getPersistedAssetBlob(ref) || asset?.blob;
    if (!blob) continue;

    const name = sanitizeFileName(asset?.fileName || `upload-${entriesByRef.size + 1}.png`);
    const path = makeUniqueUploadPath(name, usedPaths);
    const entry = { urls: [ref, getAssetPreviewUrl(ref)].filter(Boolean), blob, path };

    entriesByRef.set(ref, entry);
    usedPaths.add(path);
  }

  return Array.from(entriesByRef.values());
}

function collectUploadedAssets(project) {
  const values = [];
  collectStrings(project, values);
  const entriesByUrl = new Map();
  const usedPaths = new Set();

  values
    .filter((value) => value.startsWith("blob:"))
    .forEach((url, index) => {
      if (entriesByUrl.has(url)) return;

      const file = getManagedObjectUrlFile(url);
      if (!file) return;

      const name = sanitizeFileName(file.name || `upload-${index + 1}.png`);
      const path = makeUniqueUploadPath(name, usedPaths);
      const entry = { urls: [url], file, path };

      entriesByUrl.set(url, entry);
      usedPaths.add(path);
    });

  return Array.from(entriesByUrl.values());
}

function rewriteHtmlAssetPaths(html, uploadEntries = []) {
  let nextHtml = html
    .replace(/%20/g, " ");
  uploadEntries.forEach((entry) => {
    entry.urls.forEach((url) => {
      nextHtml = nextHtml.split(url).join(entry.path);
    });
  });
  return nextHtml;
}

function sanitizeFileName(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "upload";
}

function makeUniqueUploadPath(fileName, usedPaths) {
  const safeName = fileName || "upload.png";
  const dotIndex = safeName.lastIndexOf(".");
  const stem = dotIndex > 0 ? safeName.slice(0, dotIndex) : safeName;
  const extension = dotIndex > 0 ? safeName.slice(dotIndex) : "";
  let path = `assets/uploads/${safeName}`;
  let suffix = 2;

  while (usedPaths.has(path)) {
    path = `assets/uploads/${stem}-${suffix}${extension}`;
    suffix += 1;
  }

  return path;
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

async function writeNestedFile(directoryHandle, filePath, data) {
  const parts = filePath.split("/").filter(Boolean);
  const fileName = parts.pop();
  let currentHandle = directoryHandle;

  for (const part of parts) {
    currentHandle = await currentHandle.getDirectoryHandle(part, { create: true });
  }

  const fileHandle = await currentHandle.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(data);
  await writable.close();
}

export default exportLandingFolder;
