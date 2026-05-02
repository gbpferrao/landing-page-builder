import { assetPath } from "../domain/assetRegistry.js";
import { getAssetPreviewUrl } from "../lib/objectUrls.js";
import { isIndexedDbAssetRef } from "../lib/projectStore.js";

export function resolveTemplate(value, project) {
  if (value === "{{brand.whatsappUrl}}" || value === "{{site.whatsappUrl}}") {
    return project.site.brand.whatsappUrl;
  }

  return value || "#";
}

export function previewAsset(fileName, base = "assets/") {
  if (!fileName) return "";
  if (isIndexedDbAssetRef(fileName)) return getAssetPreviewUrl(fileName);
  return assetPath(fileName, base);
}

export function youtubeEmbedUrl(url) {
  const rawUrl = String(url || "").trim();
  if (!rawUrl || rawUrl.includes("PASTE_VIDEO_ID_HERE")) return "";

  try {
    const parsed = new URL(rawUrl);
    let videoId = "";

    if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.split("/").filter(Boolean)[0] || "";
    } else if (parsed.pathname.includes("/shorts/")) {
      videoId = parsed.pathname.split("/shorts/")[1].split("/")[0] || "";
    } else if (parsed.pathname.includes("/embed/")) {
      videoId = parsed.pathname.split("/embed/")[1].split("/")[0] || "";
    } else {
      videoId = parsed.searchParams.get("v") || "";
    }

    return videoId ? `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?rel=0&modestbranding=1&playsinline=1` : "";
  } catch {
    return "";
  }
}

export function buttonClass(button = {}) {
  const color = button.color === "green" ? "green" : "black";
  const rounding = button.rounding === "pill" ? "pill" : button.rounding === "soft" ? "soft" : "square";
  return `whatsapp-button whatsapp-button-${color} whatsapp-button-${rounding}`;
}

export function ratingStars(rating = 5) {
  const safeRating = Math.max(1, Math.min(5, Number(rating) || 5));
  return "★".repeat(safeRating);
}
