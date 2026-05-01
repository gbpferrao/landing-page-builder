export const solutionsSchema = {
  id: "solutions",
  label: "Solucoes",
  slots: [
    { path: "sections.solutions.content.title", label: "Titulo", type: "textarea", group: "content" },
    { path: "sections.solutions.content.eyebrow", label: "Chamada", type: "text", group: "content" },
    { path: "sections.solutions.content.items", label: "Itens de solucao", type: "repeater", group: "content" }
  ]
};
