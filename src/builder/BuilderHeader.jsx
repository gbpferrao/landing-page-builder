import { ArrowLeft, Download, HelpCircle } from "lucide-react";
import AppHeader, { appHeaderPrimaryButtonClass, appHeaderSecondaryButtonClass } from "../app/AppHeader.jsx";
import Button from "../design-system/Button.jsx";
import { sanitizeFolderName } from "../lib/exportLandingFolder.js";

export function BuilderHeader({ exportStatus = "idle", onBackToProjects, onExport, onHelp, onPageNameChange, pageName }) {
  const folderName = sanitizeFolderName(pageName);

  return (
    <AppHeader
      backAction={(
        <Button
          variant="secondary"
          icon={ArrowLeft}
          className={`${appHeaderSecondaryButtonClass} !h-9 !w-9 !px-0`}
          aria-label="Voltar para projetos"
          title="Voltar para projetos"
          onClick={onBackToProjects}
        />
      )}
      projectControl={(
        <label className="header-page-name" title={`ZIP baixado: ${folderName}.zip`}>
          <span>Projeto</span>
          <input
            value={pageName}
            aria-label="Nome do projeto e da pasta"
            onChange={(event) => onPageNameChange(event.target.value)}
          />
        </label>
      )}
      actions={(
        <>
        <Button
          variant="secondary"
          icon={HelpCircle}
          className={appHeaderSecondaryButtonClass}
          onClick={onHelp}
        >
          Ajuda
        </Button>
        <Button
          icon={Download}
          loading={exportStatus === "working"}
          className={appHeaderPrimaryButtonClass}
          onClick={onExport}
        >
          {exportStatus === "working" ? "Gerando" : "Baixar ZIP"}
        </Button>
        </>
      )}
    />
  );
}

export default BuilderHeader;
