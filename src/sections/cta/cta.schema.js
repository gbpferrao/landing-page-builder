export const ctaSchema = {
  id: "cta",
  label: "CTA final",
  slots: [
    { path: "sections.cta.content.title", label: "Titulo", type: "textarea", group: "content" },
    { path: "sections.cta.content.text", label: "Texto", type: "textarea", group: "content" },
    { path: "sections.cta.content.button.label", label: "Texto do botao", type: "text", group: "content" }
  ]
};
