export const heroSchema = {
  id: "hero",
  label: "Hero",
  slots: [
    { path: "sections.hero.content.eyebrow", label: "Chamada", type: "text", group: "content" },
    { path: "sections.hero.content.title", label: "Titulo", type: "textarea", group: "content" },
    { path: "sections.hero.content.subtitle", label: "Subtitulo", type: "textarea", group: "content" },
    { path: "sections.hero.content.bullets", label: "Bullets", type: "list", group: "content" },
    { path: "sections.hero.content.reassurance", label: "Reforco", type: "text", group: "content" },
    { path: "sections.hero.content.button.label", label: "Texto do CTA", type: "text", group: "content" },
    { path: "sections.hero.content.button.url", label: "URL do CTA", type: "url", group: "content" },
    { path: "sections.hero.content.media.url", label: "Video YouTube", type: "url", group: "content" }
  ]
};
