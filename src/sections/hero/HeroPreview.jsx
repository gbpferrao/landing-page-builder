import { buttonClass, previewAsset, resolveTemplate, youtubeEmbedUrl } from "../../preview/previewUtils.js";
import { WhatsappIcon } from "../../preview/previewIcons.jsx";

export function HeroPreview({ project }) {
  const brand = project.site.brand;
  const hero = project.sections.hero;
  const content = hero.content;
  const button = content.button || {};
  const embedUrl = content.media?.type === "youtube" ? youtubeEmbedUrl(content.media.url) : "";
  const hasVideo = Boolean(embedUrl);

  return (
    <>
      <header className="site-header" aria-label="Cabecalho">
        <div className="container header-inner">
          <a className="header-logo" href="#top" aria-label={brand.name}>
            <img src={previewAsset(brand.logo)} alt={brand.name} />
          </a>
        </div>
      </header>
      <section className={`hero section-dark ${hasVideo ? "has-hero-video" : "no-hero-video"}`}>
        <div className={`container ${hasVideo ? "split" : "hero-centered"}`}>
          <div className="hero-copy">
            <p className="eyebrow">{content.eyebrow}</p>
            <h1>{content.title}</h1>
            <p className="lead">{content.subtitle}</p>
            <ul className="hero-bullets">
              {(content.bullets || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <a
              className={buttonClass(button)}
              href={resolveTemplate(button.url, project)}
            >
              <WhatsappIcon />
              <span>{button.label}</span>
            </a>
            {content.reassurance ? <p className="hero-reassurance">{content.reassurance}</p> : null}
          </div>
          {hasVideo ? (
            <div className="hero-media video-slot">
              <iframe
                src={embedUrl}
                title={content.media?.title || "Video"}
                data-track-video=""
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}

export default HeroPreview;
