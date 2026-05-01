export const footerSchema = {
  id: "footer",
  label: "Rodape",
  slots: [
    { path: "site.footer.address", label: "Endereco", type: "textarea", group: "content" },
    { path: "site.footer.phone", label: "Telefone", type: "text", group: "content" },
    { path: "site.footer.email", label: "Email", type: "email", group: "content" },
    { path: "site.footer.instagram", label: "Instagram", type: "url", group: "content" },
    { path: "site.footer.instagramHandle", label: "Usuario Instagram", type: "text", group: "content" }
  ]
};
