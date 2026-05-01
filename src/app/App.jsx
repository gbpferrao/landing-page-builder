import { useMemo, useState } from "react";
import BuilderShell from "../builder/BuilderShell.jsx";
import { defaultProject } from "../domain/defaultProject.js";
import { normalizeProject } from "../domain/normalizeProject.js";
import { exportHtml } from "../preview/exportHtml.jsx";

const initialProject = normalizeProject(defaultProject);

export default function App() {
  const [project, setProject] = useState(initialProject);
  const previewHtml = useMemo(() => exportHtml(project), [project]);

  return (
    <BuilderShell
      project={project}
      onProjectChange={setProject}
      previewHtml={previewHtml}
    />
  );
}
