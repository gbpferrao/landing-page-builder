export const valueSchema = {
  id: "value",
  label: "Secao de valor",
  slots: [
    { path: "sections.value.content.title", label: "Titulo", type: "textarea", group: "content" },
    { path: "sections.value.content.subtitle", label: "Subtitulo", type: "textarea", group: "content" },
    { path: "sections.value.content.highlights", label: "Destaques", type: "list", group: "content" },
    { path: "sections.value.content.paragraphs", label: "Paragrafos", type: "list", group: "content" },
    { path: "sections.value.content.button.label", label: "Texto do CTA", type: "text", group: "content" },
    { path: "sections.value.assets.image.src", label: "Imagem", type: "image", group: "assets" },
    { path: "sections.value.assets.image.alt", label: "Alt da imagem", type: "text", group: "assets" }
  ]
};
