import { ctaSchema } from "../sections/cta/cta.schema.js";
import { faqSchema } from "../sections/faq/faq.schema.js";
import { footerSchema } from "../sections/footer/footer.schema.js";
import { heroSchema } from "../sections/hero/hero.schema.js";
import { problemsSchema } from "../sections/problems/problems.schema.js";
import { solutionsSchema } from "../sections/solutions/solutions.schema.js";
import { teamSchema } from "../sections/team/team.schema.js";
import { testimonialsSchema } from "../sections/testimonials/testimonials.schema.js";
import { valueSchema } from "../sections/value/value.schema.js";
import { getPath } from "./projectPaths.js";

export const sectionSchemas = [
  heroSchema,
  problemsSchema,
  solutionsSchema,
  valueSchema,
  teamSchema,
  testimonialsSchema,
  ctaSchema,
  faqSchema,
  footerSchema
];

export const sectionOrder = sectionSchemas.map((section) => section.id);

export const globalSlots = [
  { path: "site.meta.title", label: "Titulo SEO", type: "text", group: "site" },
  { path: "site.meta.description", label: "Descricao SEO", type: "textarea", group: "site" },
  { path: "site.brand.name", label: "Marca", type: "text", group: "site" },
  { path: "site.brand.logo", label: "Logo", type: "image", group: "assets" },
  { path: "site.brand.whatsappUrl", label: "WhatsApp", type: "url", group: "site" },
  { path: "site.tracking.providers.ga4.enabled", label: "Ativar GA4", type: "boolean", group: "tracking" },
  { path: "site.tracking.providers.ga4.measurementId", label: "GA4 Measurement ID", type: "text", group: "tracking" },
  { path: "site.tracking.providers.googleAds.enabled", label: "Ativar Google Ads", type: "boolean", group: "tracking" },
  { path: "site.tracking.providers.googleAds.conversionId", label: "Google Ads Conversion ID", type: "text", group: "tracking" },
  { path: "site.tracking.providers.meta.enabled", label: "Ativar Meta Pixel", type: "boolean", group: "tracking" },
  { path: "site.tracking.providers.meta.pixelId", label: "Meta Pixel ID", type: "text", group: "tracking" },
  { path: "site.tracking.pageView", label: "PageView da landing", type: "tracking-event", group: "tracking" },
  { path: "site.tracking.videoClick", label: "Clique no video", type: "tracking-event", group: "tracking" },
  { path: "site.tracking.videoWatch", label: "Assistiu X segundos", type: "tracking-event", group: "tracking" },
  { path: "site.tracking.whatsappClick", label: "Clique em WhatsApp", type: "tracking-event", group: "tracking" }
];

export function allSlotDescriptors() {
  return [
    ...globalSlots,
    ...sectionSchemas.flatMap((section) => section.slots.map((slot) => ({
      ...slot,
      section: section.id,
      sectionLabel: section.label
    })))
  ];
}

export function validateProjectShape(project) {
  const requiredPaths = [
    "site.meta",
    "site.brand",
    "site.footer",
    "site.tracking",
    "sections.hero",
    "sections.value",
    "sections.testimonials",
    "sections.cta",
    "sections.faq",
    "sections.footer"
  ];

  const missing = requiredPaths.filter((path) => getPath(project, path) == null);
  return {
    valid: missing.length === 0,
    missing
  };
}
