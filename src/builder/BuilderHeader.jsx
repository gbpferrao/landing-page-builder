import { FolderDown, HelpCircle, LayoutGrid } from "lucide-react";
import Button from "../design-system/Button.jsx";
import { sanitizeFolderName } from "../lib/exportLandingFolder.js";

export function BuilderHeader({ exportStatus = "idle", onBackToProjects, onExport, onHelp, onPageNameChange, pageName }) {
  const folderName = sanitizeFolderName(pageName);

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-800 bg-black px-5 py-2">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-gold-400">
          Gerador estatico
        </p>
        <h1 className="truncate text-xl font-medium text-white">
          Construtor de Landing Page V2
        </h1>
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
          className="border-white/15 bg-white/10 text-white hover:bg-white/16"
          onClick={onBackToProjects}
        >
          Projetos
        </Button>
        <Button
          variant="secondary"
          icon={HelpCircle}
          className="border-white/15 bg-white/10 text-white hover:bg-white/16"
          onClick={onHelp}
        >
          Ajuda
        </Button>
        <Button
          icon={FolderDown}
          loading={exportStatus === "working"}
          className="border-white bg-white text-black hover:bg-white/90"
          onClick={onExport}
        >
          {exportStatus === "working" ? "Gerando" : "Exportar pasta"}
        </Button>
      </div>
    </header>
  );
}

export default BuilderHeader;
