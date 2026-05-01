export function getPath(target, path, fallback = undefined) {
  if (!path) return target;
  const value = path.split(".").reduce((cursor, part) => {
    if (cursor == null) return undefined;
    return cursor[part];
  }, target);
  return value === undefined ? fallback : value;
}

export function setPath(target, path, value) {
  const parts = path.split(".");
  const next = clone(target);
  let cursor = next;

  parts.slice(0, -1).forEach((part) => {
    if (!isPlainObject(cursor[part]) && !Array.isArray(cursor[part])) {
      cursor[part] = {};
    }
    cursor = cursor[part];
  });

  cursor[parts.at(-1)] = value;
  return next;
}

export function updatePath(target, path, updater) {
  return setPath(target, path, updater(getPath(target, path)));
}

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function mergeProject(base, override) {
  if (Array.isArray(base) || Array.isArray(override) || !isPlainObject(base) || !isPlainObject(override)) {
    return clone(override ?? base);
  }

  const merged = clone(base);
  Object.keys(override).forEach((key) => {
    merged[key] = key in base ? mergeProject(base[key], override[key]) : clone(override[key]);
  });
  return merged;
}

export function flattenSlotValues(project, descriptors) {
  return descriptors.reduce((values, slot) => {
    values[slot.path] = getPath(project, slot.path);
    return values;
  }, {});
}
