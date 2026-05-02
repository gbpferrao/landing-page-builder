import { FolderDown, HelpCircle, LayoutGrid } from "lucide-react";
import Button from "../design-system/Button.jsx";
import { sanitizeFolderName } from "../lib/exportLandingFolder.js";

export function BuilderHeader({ exportStatus = "idle", onBackToProjects, onExport, onHelp, onPageNameChange, pageName }) {
  const folderName = sanitizeFolderName(pageName);

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-800 bg-black px-5 py-2">
      <div className="flex min-w-0 items-center gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold leading-5 text-white">
            A&amp;A Page Builder
          </h1>
          <p className="mt-0.5 truncate text-xs font-medium text-white/55">
            Landing studio
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <label className="header-page-name" title={`Pasta exportada: ${folderName}`}>
          <span>Projeto</span>
          <input
            value={pageName}
            aria-label="Nome do projeto e da pasta"
            onChange={(event) => onPageNameChange(event.target.value)}
          />
        </label>
        <Button
          variant="secondary"
          icon={LayoutGrid}
          className="border-white/15 bg-white/10 text-white hover:border-white/30 hover:bg-white/20 hover:text-white"
          onClick={onBackToProjects}
        >
          Projetos
        </Button>
        <Button
          variant="secondary"
          icon={HelpCircle}
          className="border-white/15 bg-white/10 text-white hover:border-white/30 hover:bg-white/20 hover:text-white"
          onClick={onHelp}
        >
          Ajuda
        </Button>
        <Button
          icon={FolderDown}
          loading={exportStatus === "working"}
          className="border-white bg-white text-black hover:border-white/90 hover:bg-white/90 hover:text-black"
          onClick={onExport}
        >
          {exportStatus === "working" ? "Gerando" : "Exportar pasta"}
        </Button>
      </div>
    </header>
  );
}

export default BuilderHeader;
