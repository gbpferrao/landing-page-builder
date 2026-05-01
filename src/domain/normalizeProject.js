import { defaultProject } from "./defaultProject.js";
import { clone, isPlainObject, mergeProject } from "./projectPaths.js";

export function normalizeProject(input) {
  if (!isPlainObject(input)) return clone(defaultProject);
  return input.site && input.sections ? mergeProject(defaultProject, input) : clone(defaultProject);
}

export function serializeProject(project) {
  return JSON.stringify(normalizeProject(project), null, 2);
}
