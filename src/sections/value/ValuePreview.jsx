import { buttonClass, previewAsset, resolveTemplate } from "../../preview/previewUtils.js";
import { WhatsappIcon } from "../../preview/previewIcons.jsx";

export function ValuePreview({ project }) {
  const section = project.sections.value;
  const content = section.content;
  const image = section.assets?.image || {};
  const button = content.button || {};

  return (
    <section className="section inset-value-section">
      <div className="container value-panel split">
        <div className="value-copy">
          <h2>{content.title}</h2>
          <p className="lead">{content.subtitle}</p>
          <ul className="value-highlights">
            {(content.highlights || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {(content.paragraphs || []).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <a className={buttonClass(button)} href={resolveTemplate(button.url, project)}>
            <WhatsappIcon />
            <span>{button.label}</span>
          </a>
        </div>
        <img className="portrait" src={previewAsset(image.src)} alt={image.alt || content.title} />
      </div>
    </section>
  );
}

export default ValuePreview;
