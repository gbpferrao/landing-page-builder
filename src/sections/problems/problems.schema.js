export const problemsSchema = {
  id: "problems",
  label: "Problemas",
  slots: [
    { path: "sections.problems.content.title", label: "Titulo", type: "textarea", group: "content" },
    { path: "sections.problems.content.eyebrow", label: "Chamada", type: "text", group: "content" },
    { path: "sections.problems.content.intro", label: "Introducao", type: "textarea", group: "content" },
    { path: "sections.problems.content.cards", label: "Cards de problema", type: "repeater", group: "content" }
  ]
};
