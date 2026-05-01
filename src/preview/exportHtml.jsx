import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import LandingPage from "./LandingPage.jsx";
import landingCss from "./landing-page.css?raw";
import { buildTrackingHead, buildTrackingRuntime } from "./trackingSnippets.js";

export function exportHtml(project, options = {}) {
  const inlineCss = options.inlineCss ?? true;
  const markup = renderToStaticMarkup(<LandingPage project={project} />);
  const meta = project.site.meta || {};
  const trackingHead = buildTrackingHead(project);
  const trackingRuntime = buildTrackingRuntime(project);

  return `<!doctype html>
<html lang="${escapeAttribute(meta.language || "pt-BR")}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(meta.title || "")}</title>
  <meta name="description" content="${escapeAttribute(meta.description || "")}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@700;800&display=swap" rel="stylesheet">
  ${inlineCss ? `<style>${landingCss}</style>` : `<link rel="stylesheet" href="styles.css">`}
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js" defer></script>
  ${trackingHead}
</head>
<body id="top">
  ${markup}
  ${landingRuntime}
  ${trackingRuntime}
</body>
</html>`;
}

const landingRuntime = `<script>
  window.addEventListener("DOMContentLoaded", function () {
    if (window.lucide) window.lucide.createIcons();
    document.querySelectorAll("[data-review-carousel]").forEach(function (carousel) {
      var track = carousel.querySelector("[data-review-track]");
      var prev = carousel.querySelector("[data-review-prev]");
      var next = carousel.querySelector("[data-review-next]");
      if (!track || !prev || !next) return;
      var scrollByCard = function (direction) {
        var card = track.querySelector(".review-card");
        var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 0);
        var distance = card ? card.getBoundingClientRect().width + gap : track.clientWidth;
        track.scrollBy({ left: direction * distance, behavior: "smooth" });
      };
      prev.addEventListener("click", function () { scrollByCard(-1); });
      next.addEventListener("click", function () { scrollByCard(1); });
    });
  });
</script>`;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

export { landingCss };
export default exportHtml;
