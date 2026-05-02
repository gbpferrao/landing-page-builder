import { Copy, FilePlus2, FolderOpen, Trash2, X } from "lucide-react";
import { useState } from "react";
import AppHeader, { appHeaderPrimaryButtonClass } from "../app/AppHeader.jsx";
import Button from "../design-system/Button.jsx";
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from "../design-system/Card.jsx";
import Dialog from "../design-system/Dialog.jsx";

export function ProjectsView({ projects, onCreateProject, onDeleteProject, onDuplicateProject, onOpenProject }) {
  const [projectToDelete, setProjectToDelete] = useState(null);

  const confirmDelete = () => {
    if (!projectToDelete) return;
    onDeleteProject(projectToDelete.id);
    setProjectToDelete(null);
  };

  return (
    <>
      <main className="projects-view">
        <AppHeader
          actions={(
            <Button
              icon={FilePlus2}
              className={appHeaderPrimaryButtonClass}
              onClick={onCreateProject}
            >
              Novo projeto
            </Button>
          )}
        />

        <section className="projects-grid" aria-label="Projetos salvos">
          {projects.length ? (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.name}
                subtitle={formatUpdatedAt(project.updatedAt)}
                detail={`/${project.folderName || project.name}/`}
                actions={(
                  <>
                    <Button size="sm" icon={FolderOpen} onClick={() => onOpenProject(project.id)}>
                      Abrir
                    </Button>
                    <Button size="sm" variant="secondary" icon={Copy} onClick={() => onDuplicateProject(project.id)}>
                      Duplicar
                    </Button>
                  </>
                )}
                deleteLabel={`Excluir ${project.name}`}
                onDelete={() => setProjectToDelete(project)}
              />
            ))
          ) : (
            <ProjectCard
              title="Nenhum projeto salvo"
              subtitle="Ainda nao salvo"
              detail="Crie uma landing para salvar textos, configuracoes e imagens."
              actions={(
                <>
                  <Button size="sm" icon={FilePlus2} onClick={onCreateProject}>
                    Criar primeiro projeto
                  </Button>
                </>
              )}
            />
          )}
        </section>
      </main>
      <Dialog
        open={Boolean(projectToDelete)}
        onOpenChange={(open) => {
          if (!open) setProjectToDelete(null);
        }}
        title="Excluir projeto?"
        description={projectToDelete ? `Esta acao remove "${projectToDelete.name}" deste navegador.` : ""}
        footer={(
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setProjectToDelete(null)}>Cancelar</Button>
            <Button variant="danger" icon={Trash2} onClick={confirmDelete}>Excluir</Button>
          </div>
        )}
      >
        <p className="text-sm leading-6 text-muted">
          O projeto salvo sera removido da lista local. Pastas que voce ja exportou ou publicou nao sao alteradas.
        </p>
      </Dialog>
    </>
  );
}

function ProjectCard({ actions, deleteLabel, detail, onDelete, subtitle, title }) {
  return (
    <Card className="project-card">
      <CardHeader className="project-card-header">
        <div className="min-w-0">
          <CardTitle className="truncate">{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="project-card-content">
        <p className="project-slug">{detail}</p>
        <div className="project-actions">{actions}</div>
      </CardContent>
      {onDelete ? (
        <button
          type="button"
          className="project-card-delete"
          aria-label={deleteLabel}
          onClick={onDelete}
        >
          <X size={14} aria-hidden="true" />
        </button>
      ) : null}
    </Card>
  );
}

function formatUpdatedAt(value) {
  if (!value) return "Ainda nao salvo";

  try {
    return `Atualizado em ${new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(new Date(value))}`;
  } catch {
    return "Atualizado recentemente";
  }
}

export default ProjectsView;
