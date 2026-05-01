import { Download, HelpCircle } from "lucide-react";
import Button from "../design-system/Button.jsx";

export function BuilderHeader({ exportStatus = "idle", onExport, onHelp }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-line bg-surface px-5 py-3">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-gold-600">
          Gerador estatico
        </p>
        <h1 className="truncate text-xl font-medium text-ink-950">
          Construtor de Landing Page V2
        </h1>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button variant="secondary" icon={HelpCircle} onClick={onHelp}>
          Ajuda
        </Button>
        <Button icon={Download} loading={exportStatus === "working"} onClick={onExport}>
          {exportStatus === "working" ? "Gerando" : "Exportar"}
        </Button>
      </div>
    </header>
  );
}

export default BuilderHeader;
