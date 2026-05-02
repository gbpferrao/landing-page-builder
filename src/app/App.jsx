import { useEffect, useMemo, useRef, useState } from "react";
import BuilderShell from "../builder/BuilderShell.jsx";
import { defaultProject } from "../domain/defaultProject.js";
import { normalizeProject } from "../domain/normalizeProject.js";
import { registerPersistedAsset, revokeAllObjectUrls } from "../lib/objectUrls.js";
import { collectAssetRefs, deleteProject, getAsset, getAssetIdFromRef, getProject, listProjects, makeProjectId, saveProject } from "../lib/projectStore.js";
import { exportHtml } from "../preview/exportHtml.jsx";
import ProjectsView from "../projects/ProjectsView.jsx";
import { sanitizeFolderName } from "../lib/exportLandingFolder.js";

const initialProject = normalizeProject(defaultProject);

export default function App() {
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState("");
  const [project, setProject] = useState(initialProject);
  const [previewProject, setPreviewProject] = useState(initialProject);
  const [pageName, setPageName] = useState("landing-page");
  const [view, setView] = useState("projects");
  const saveTimerRef = useRef(null);
  const previewTimerRef = useRef(null);
  const previewHtml = useMemo(() => exportHtml(previewProject), [previewProject]);

  useEffect(() => {
    refreshProjects();
  }, []);

  useEffect(() => () => {
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    if (previewTimerRef.current) window.clearTimeout(previewTimerRef.current);
    revokeAllObjectUrls();
  }, []);

  useEffect(() => {
    if (view !== "editor") return;
    if (previewTimerRef.current) window.clearTimeout(previewTimerRef.current);

    previewTimerRef.current = window.setTimeout(() => {
      setPreviewProject(project);
    }, 3000);
  }, [project, view]);

  useEffect(() => {
    if (!activeProjectId || view !== "editor") return;
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);

    saveTimerRef.current = window.setTimeout(async () => {
      const saved = await saveProject({
        id: activeProjectId,
        name: pageName || "landing-page",
        folderName: sanitizeFolderName(pageName),
        project
      });
      setProjects((currentProjects) => upsertProjectSummary(currentProjects, saved));
    }, 450);
  }, [activeProjectId, pageName, project, view]);

  const refreshProjects = async () => {
    setProjects(await listProjects());
  };

  const createProject = async () => {
    const id = makeProjectId();
    const record = await saveProject({
      id,
      name: "landing-page",
      folderName: "landing-page",
      project: initialProject
    });
    setProjects((currentProjects) => upsertProjectSummary(currentProjects, record));
    await openProject(record.id);
  };

  const openProject = async (projectId) => {
    const record = await getProject(projectId);
    if (!record) return;

    revokeAllObjectUrls();
    await hydrateProjectAssets(record.project);
    setActiveProjectId(record.id);
    setPageName(record.name || record.folderName || "landing-page");
    const normalizedProject = normalizeProject(record.project);
    setProject(normalizedProject);
    setPreviewProject(normalizedProject);
    setView("editor");
  };

  const duplicateProject = async (projectId) => {
    const record = await getProject(projectId);
    if (!record) return;

    const nextName = `${record.name || "landing-page"}-copy`;
    const duplicate = await saveProject({
      id: makeProjectId(),
      name: nextName,
      folderName: sanitizeFolderName(nextName),
      project: record.project
    });
    setProjects((currentProjects) => upsertProjectSummary(currentProjects, duplicate));
  };

  const removeProject = async (projectId) => {
    await deleteProject(projectId);
    setProjects((currentProjects) => currentProjects.filter((item) => item.id !== projectId));
    if (activeProjectId === projectId) {
      setActiveProjectId("");
      setView("projects");
    }
  };

  const returnToProjects = async () => {
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    if (activeProjectId) {
      const saved = await saveProject({
        id: activeProjectId,
        name: pageName || "landing-page",
        folderName: sanitizeFolderName(pageName),
        project
      });
      setProjects((currentProjects) => upsertProjectSummary(currentProjects, saved));
    }
    setView("projects");
    await refreshProjects();
  };

  const changePageName = (nextName) => {
    setPageName(nextName);
  };

  if (view === "projects") {
    return (
      <ProjectsView
        projects={projects}
        onCreateProject={createProject}
        onDeleteProject={removeProject}
        onDuplicateProject={duplicateProject}
        onOpenProject={openProject}
      />
    );
  }

  return (
    <BuilderShell
      project={project}
      pageName={pageName}
      onBackToProjects={returnToProjects}
      onProjectChange={setProject}
      onPageNameChange={changePageName}
      previewHtml={previewHtml}
    />
  );
}

async function hydrateProjectAssets(project) {
  const refs = Array.from(collectAssetRefs(project));
  for (const ref of refs) {
    const asset = await getAsset(getAssetIdFromRef(ref));
    if (asset?.blob) registerPersistedAsset(ref, asset.blob);
  }
}

function upsertProjectSummary(projects, record) {
  const nextProjects = [record, ...projects.filter((item) => item.id !== record.id)];
  return nextProjects.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
}
