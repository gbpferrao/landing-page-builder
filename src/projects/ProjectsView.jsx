import { Copy, FilePlus2, FolderOpen, Trash2 } from "lucide-react";
import Button from "../design-system/Button.jsx";
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from "../design-system/Card.jsx";

export function ProjectsView({ projects, onCreateProject, onDeleteProject, onDuplicateProject, onOpenProject }) {
  return (
    <main className="projects-view">
      <section className="projects-header">
        <div>
          <p>Gerador estatico</p>
          <h1>Projetos de landing page</h1>
        </div>
        <Button icon={FilePlus2} onClick={onCreateProject}>
          Novo projeto
        </Button>
      </section>

      <section className="projects-grid" aria-label="Projetos salvos">
        {projects.length ? (
          projects.map((project) => (
            <Card key={project.id} className="project-card">
              <CardHeader>
                <div className="min-w-0">
                  <CardTitle className="truncate">{project.name}</CardTitle>
                  <CardDescription>{formatUpdatedAt(project.updatedAt)}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="project-slug">/{project.folderName || project.name}/</p>
                <div className="project-actions">
                  <Button size="sm" icon={FolderOpen} onClick={() => onOpenProject(project.id)}>
                    Abrir
                  </Button>
                  <Button size="sm" variant="secondary" icon={Copy} onClick={() => onDuplicateProject(project.id)}>
                    Duplicar
                  </Button>
                  <Button size="sm" variant="ghost" icon={Trash2} onClick={() => onDeleteProject(project.id)}>
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="projects-empty">
            <CardHeader>
              <CardTitle>Nenhum projeto salvo</CardTitle>
              <CardDescription>Crie uma landing para salvar textos, configuracoes e imagens neste navegador.</CardDescription>
            </CardHeader>
            <Button icon={FilePlus2} onClick={onCreateProject}>
              Criar primeiro projeto
            </Button>
          </Card>
        )}
      </section>
    </main>
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
