import { useState } from "react";
import { Clipboard, Download, Eye, FileArchive, UploadCloud, Wand2 } from "lucide-react";
import BuilderHeader from "./BuilderHeader.jsx";
import BuilderSidebar from "./BuilderSidebar.jsx";
import PreviewCanvas from "./PreviewCanvas.jsx";
import Button from "../design-system/Button.jsx";
import Dialog from "../design-system/Dialog.jsx";
import { Toast, ToastViewport } from "../design-system/Toast.jsx";
import { downloadLandingZip } from "../lib/buildZip.js";

export function BuilderShell({ onProjectChange, previewHtml, project }) {
  const [helpOpen, setHelpOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState("ready");

  const handleExport = async () => {
    setExportStatus("working");
    try {
      await downloadLandingZip(project);
      setExportStatus("done");
    } catch {
      setExportStatus("error");
    }
  };

  return (
    <div className="builder-shell">
      <BuilderHeader exportStatus={exportStatus} onExport={handleExport} onHelp={() => setHelpOpen(true)} />
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
                <h3>Publicar na Hostinger</h3>
                <p>Use o ZIP exportado pelo builder como pacote final da landing.</p>
              </div>
            </div>
            <ol>
              <li>Clique em Exportar para baixar o ZIP com index.html, styles.css e assets.</li>
              <li>No painel da Hostinger, abra Gerenciador de Arquivos do dominio.</li>
              <li>Entre em public_html, envie o ZIP e use Extrair para soltar os arquivos nessa pasta.</li>
              <li>Confirme que index.html ficou direto em public_html, junto com styles.css e a pasta assets.</li>
              <li>Abra o dominio em uma aba anonima e teste os botoes, imagens, mobile e tags configuradas.</li>
            </ol>
            <div className="help-note">
              <Download size={16} aria-hidden="true" />
              <span>Se ja existir uma pagina antiga, mova ou substitua os arquivos antigos antes de testar a nova landing.</span>
            </div>
          </section>
        </div>
      </Dialog>
      <ToastViewport>
        {exportStatus === "done" ? (
          <Toast
            type="success"
            title="ZIP exportado"
            description="O pacote contem index.html, styles.css e assets para publicacao."
            duration={3500}
            onClose={() => setExportStatus("ready")}
          />
        ) : null}
        {exportStatus === "error" ? (
          <Toast
            type="error"
            title="Falha ao exportar"
            description="Confira se os assets referenciados existem e tente novamente."
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
