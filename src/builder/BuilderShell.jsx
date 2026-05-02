import { useState } from "react";
import { Clipboard, Download, Eye, FileArchive, UploadCloud, Wand2 } from "lucide-react";
import BuilderHeader from "./BuilderHeader.jsx";
import BuilderSidebar from "./BuilderSidebar.jsx";
import PreviewCanvas from "./PreviewCanvas.jsx";
import Button from "../design-system/Button.jsx";
import Dialog from "../design-system/Dialog.jsx";
import { Toast, ToastViewport } from "../design-system/Toast.jsx";
import { exportLandingFolder, sanitizeFolderName } from "../lib/exportLandingFolder.js";

export function BuilderShell({ onBackToProjects, onPageNameChange, onProjectChange, pageName, previewHtml, project }) {
  const [helpOpen, setHelpOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState("ready");
  const folderName = sanitizeFolderName(pageName);

  const handleExport = async () => {
    setExportStatus("working");
    try {
      await exportLandingFolder(project, folderName);
      setExportStatus("done");
    } catch {
      setExportStatus("error");
    }
  };

  return (
    <div className="builder-shell">
      <BuilderHeader
        exportStatus={exportStatus}
        pageName={pageName}
        onBackToProjects={onBackToProjects}
        onExport={handleExport}
        onHelp={() => setHelpOpen(true)}
        onPageNameChange={onPageNameChange}
      />
      <main className="builder-frame">
        <BuilderSidebar
          project={project}
          onProjectChange={onProjectChange}
        />
        <PreviewCanvas previewHtml={previewHtml} />
      </main>
      <Dialog
        open={helpOpen}
        onOpenChange={setHelpOpen}
        title="Ajuda do builder"
        description="Siga as fases abaixo para editar, gerar copy, revisar e publicar."
        panelClassName="max-w-3xl"
        footer={<Button onClick={() => setHelpOpen(false)}>Entendi</Button>}
      >
        <div className="help-flow">
          <div className="help-phase-grid">
            <HelpPhase
              number="1"
              icon={FileArchive}
              title="Configure a base"
              text="Comece em Config geral e nas colunas Geral de cada secao. Ajuste marca, logo, contatos, equipe, depoimentos e dados institucionais."
            />
            <HelpPhase
              number="2"
              icon={Wand2}
              title="Gere a copy"
              text="Na coluna Copywriting, escreva a Instrucao geral e copie o prompt institucional ou o prompt de conversao. O prompt envia so copy e icones."
            />
            <HelpPhase
              number="3"
              icon={Clipboard}
              title="Cole e aplique"
              text="Cole o bloco ```json retornado pela IA em Colar JSON. Aplicar copywriting atualiza apenas titulos, textos, FAQs, CTAs, SEO e icones."
            />
            <HelpPhase
              number="4"
              icon={Eye}
              title="Revise o preview"
              text="Use Desktop e Mobile para conferir a pagina inteira. A preview rola por dentro, sem empurrar a configuracao do builder."
            />
          </div>

          <section className="help-hosting">
            <div className="help-hosting-header">
              <UploadCloud size={18} aria-hidden="true" />
              <div>
                <h3>Publicar em um slug na Hostinger</h3>
                <p>Exporte uma pasta estatica separada do WordPress ou Elementor.</p>
              </div>
            </div>
            <ol>
              <li>Defina o Projeto no topo. Ele vira a pasta exportada, como {folderName}.</li>
              <li>Clique em Exportar pasta e escolha onde salvar os arquivos no computador.</li>
              <li>No painel da Hostinger, abra Gerenciador de Arquivos e entre em public_html.</li>
              <li>Envie a pasta exportada inteira para public_html, sem passar pelo WordPress.</li>
              <li>Confirme que /{folderName}/ contem index.html, styles.css e assets diretamente na pasta.</li>
              <li>Abra /{folderName}/ em uma aba anonima e teste botoes, imagens, mobile e tags.</li>
            </ol>
            <div className="help-note">
              <Download size={16} aria-hidden="true" />
              <span>Nao extraia direto em public_html se o WordPress usa a home. Se ja houver uma pagina do WordPress com o mesmo slug, renomeie uma delas antes de publicar.</span>
            </div>
          </section>
        </div>
      </Dialog>
      <ToastViewport>
        {exportStatus === "done" ? (
          <Toast
            type="success"
            title="Pasta exportada"
            description={`A pasta ${folderName} contem index.html, styles.css e assets para publicacao.`}
            duration={3500}
            onClose={() => setExportStatus("ready")}
          />
        ) : null}
        {exportStatus === "error" ? (
          <Toast
            type="error"
            title="Falha ao exportar"
            description="Use Chrome ou Edge atualizado e confirme a permissao para salvar a pasta."
            onClose={() => setExportStatus("ready")}
          />
        ) : null}
      </ToastViewport>
    </div>
  );
}

function HelpPhase({ icon: Icon, number, text, title }) {
  return (
    <section className="help-phase">
      <div className="help-phase-top">
        <span>{number}</span>
        <Icon size={17} aria-hidden="true" />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </section>
  );
}

export default BuilderShell;
