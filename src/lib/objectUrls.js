const objectUrls = new Map();

export function createManagedObjectUrl(file) {
  const url = URL.createObjectURL(file);
  objectUrls.set(url, file);
  return url;
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
}
