import { FolderDown, HelpCircle, LayoutGrid } from "lucide-react";
import Button from "../design-system/Button.jsx";
import { sanitizeFolderName } from "../lib/exportLandingFolder.js";

export function BuilderHeader({ exportStatus = "idle", onBackToProjects, onExport, onHelp, onPageNameChange, pageName }) {
  const folderName = sanitizeFolderName(pageName);

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-5 py-2">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-gold-600">
          Gerador estatico
        </p>
        <h1 className="truncate text-xl font-medium text-ink-950">
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
        <Button variant="secondary" icon={LayoutGrid} onClick={onBackToProjects}>
          Projetos
        </Button>
        <Button variant="secondary" icon={HelpCircle} onClick={onHelp}>
          Ajuda
        </Button>
        <Button icon={FolderDown} loading={exportStatus === "working"} onClick={onExport}>
          {exportStatus === "working" ? "Gerando" : "Exportar pasta"}
        </Button>
      </div>
    </header>
  );
}

export default BuilderHeader;
