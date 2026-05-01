export const assetRegistry = {
  logo: {
    id: "logo",
    label: "Logo",
    fallback: "assets/defaults/logo.png",
    path: "site.brand.logo"
  },
  heroBackground: {
    id: "heroBackground",
    label: "Imagem da secao de valor",
    fallback: "assets/defaults/hero-bg.png",
    path: "sections.value.assets.image.src"
  },
  googleLogo: {
    id: "googleLogo",
    label: "Logo Google",
    fallback: "assets/defaults/google-logo.png",
    path: "sections.testimonials.assets.googleLogo"
  },
  teamProfiles: {
    id: "teamProfiles",
    label: "Fotos da equipe",
    path: "sections.team.content.profiles",
    fallbacks: [
      "assets/defaults/team/team-01.png",
      "assets/defaults/team/team-02.png",
      "assets/defaults/team/team-03.png"
    ]
  }
};

export const defaultAssetBase = "assets/";

export function assetPath(fileName, base = defaultAssetBase) {
  if (!fileName) return "";
  const value = String(fileName);
  if (/^(https?:|data:|blob:)/.test(value) || value.startsWith("/")) return value;
  if (value.startsWith("assets/")) {
    return value.split("/").map(encodeURIComponent).join("/");
  }
  return base + value.split("/").map(encodeURIComponent).join("/");
}
