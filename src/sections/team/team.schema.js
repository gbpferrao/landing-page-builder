export const teamSchema = {
  id: "team",
  label: "Equipe",
  slots: [
    { path: "sections.team.content.title", label: "Titulo", type: "text", group: "content" },
    { path: "sections.team.content.subtitle", label: "Subtitulo", type: "textarea", group: "content" },
    { path: "sections.team.content.profiles", label: "Perfis", type: "repeater", group: "content" }
  ]
};
