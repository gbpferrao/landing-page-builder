import { buttonClass, resolveTemplate } from "../../preview/previewUtils.js";
import { WhatsappIcon } from "../../preview/previewIcons.jsx";

export function CtaPreview({ project }) {
  const section = project.sections.cta;
  const content = section.content;
  const button = content.button || {};

  return (
    <section className="conversion-band">
      <div className="container band-inner">
        <div>
          <h2>{content.title}</h2>
          <p>{content.text}</p>
        </div>
        <a className={buttonClass(button)} href={resolveTemplate(button.url, project)}>
          <WhatsappIcon />
          <span>{button.label}</span>
        </a>
      </div>
    </section>
  );
}

export default CtaPreview;
