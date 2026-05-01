export const testimonialsSchema = {
  id: "testimonials",
  label: "Depoimentos",
  slots: [
    { path: "sections.testimonials.content.title", label: "Titulo", type: "text", group: "content" },
    { path: "sections.testimonials.content.readMoreUrl", label: "Link de avaliacoes", type: "url", group: "content" },
    { path: "sections.testimonials.content.readMoreLabel", label: "Texto do link", type: "text", group: "content" },
    { path: "sections.testimonials.content.disclaimer", label: "Aviso legal", type: "textarea", group: "content" },
    { path: "sections.testimonials.content.reviews", label: "Reviews", type: "repeater", group: "content" },
    { path: "sections.testimonials.assets.googleLogo", label: "Logo Google", type: "image", group: "assets" }
  ]
};
