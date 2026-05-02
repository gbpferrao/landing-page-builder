import { normalizeProject } from "../domain/normalizeProject.js";

const dbName = "landing-page-builder";
const dbVersion = 1;
const projectStoreName = "projects";
const assetStoreName = "assets";
const assetRefPrefix = "idb-asset://";

let dbPromise;

export function makeProjectId() {
  return `project-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function makeAssetId() {
  return `asset-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function makeAssetRef(assetId) {
  return `${assetRefPrefix}${assetId}`;
}

export function getAssetIdFromRef(value) {
  return typeof value === "string" && value.startsWith(assetRefPrefix)
    ? value.slice(assetRefPrefix.length)
    : "";
}

export function isIndexedDbAssetRef(value) {
  return Boolean(getAssetIdFromRef(value));
}

export async function listProjects() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(projectStoreName, "readonly").objectStore(projectStoreName).getAll();
    request.onsuccess = () => {
      resolve((request.result || []).sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || "")));
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getProject(projectId) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(projectStoreName, "readonly").objectStore(projectStoreName).get(projectId);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function saveProject(record) {
  const now = new Date().toISOString();
  const nextRecord = {
    ...record,
    project: normalizeProject(record.project),
    createdAt: record.createdAt || now,
    updatedAt: now
  };
  const db = await openDb();

  await put(projectStoreName, nextRecord);
  return nextRecord;
}

export async function deleteProject(projectId) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(projectStoreName, "readwrite");
    transaction.objectStore(projectStoreName).delete(projectId);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function saveAssetFile(file) {
  const asset = {
    id: makeAssetId(),
    fileName: file.name || "upload.png",
    type: file.type || "application/octet-stream",
    blob: file,
    createdAt: new Date().toISOString()
  };

  await put(assetStoreName, asset);
  return asset;
}

export async function getAsset(assetId) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(assetStoreName, "readonly").objectStore(assetStoreName).get(assetId);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export function collectAssetRefs(value, output = new Set()) {
  if (typeof value === "string") {
    if (isIndexedDbAssetRef(value)) output.add(value);
    return output;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectAssetRefs(item, output));
    return output;
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectAssetRefs(item, output));
  }

  return output;
}

async function put(storeName, value) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName, "readwrite").objectStore(storeName).put(value);
    request.onsuccess = () => resolve(value);
    request.onerror = () => reject(request.error);
  });
}

function openDb() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(projectStoreName)) {
        db.createObjectStore(projectStoreName, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(assetStoreName)) {
        db.createObjectStore(assetStoreName, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}
