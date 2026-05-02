const objectUrls = new Map();
const persistedAssetUrls = new Map();

export function registerPersistedAsset(assetRef, blob) {
  const existing = persistedAssetUrls.get(assetRef);
  if (existing) URL.revokeObjectURL(existing.url);

  const url = URL.createObjectURL(blob);
  persistedAssetUrls.set(assetRef, { url, blob });
  return url;
}

export function getAssetPreviewUrl(assetRef) {
  return persistedAssetUrls.get(assetRef)?.url || "";
}

export function getPersistedAssetBlob(assetRef) {
  return persistedAssetUrls.get(assetRef)?.blob || null;
}

export function revokeManagedObjectUrl(url) {
  if (!url || !objectUrls.has(url)) return;
  URL.revokeObjectURL(url);
  objectUrls.delete(url);
}

export function getManagedObjectUrlFile(url) {
  return objectUrls.get(url);
}

export function revokeAllObjectUrls() {
  objectUrls.forEach((_, url) => URL.revokeObjectURL(url));
  objectUrls.clear();
  persistedAssetUrls.forEach(({ url }) => URL.revokeObjectURL(url));
  persistedAssetUrls.clear();
}
