export const faqSchema = {
  id: "faq",
  label: "FAQ",
  slots: [
    { path: "sections.faq.content.eyebrow", label: "Chamada", type: "text", group: "content" },
    { path: "sections.faq.content.title", label: "Titulo", type: "text", group: "content" },
    { path: "sections.faq.content.questionsText", label: "Perguntas e respostas", type: "textarea", group: "content" },
    { path: "sections.faq.content.closing", label: "Fechamento", type: "textarea", group: "content" },
    { path: "sections.faq.content.checklistEyebrow", label: "Chamada do checklist", type: "text", group: "content" },
    { path: "sections.faq.content.checklistTitle", label: "Titulo do checklist", type: "text", group: "content" },
    { path: "sections.faq.content.checklistText", label: "Itens do checklist", type: "textarea", group: "content" },
    { path: "sections.faq.content.button.label", label: "Texto do CTA", type: "text", group: "content" }
  ]
};
