import { buttonClass, resolveTemplate } from "../../preview/previewUtils.js";
import { WhatsappIcon } from "../../preview/previewIcons.jsx";
import { parseChecklistText, parseFaqText } from "./faqText.js";

export function FaqPreview({ project }) {
  const section = project.sections.faq;
  const content = section.content;
  const button = content.button || {};
  const items = parseFaqText(content.questionsText);
  const checklistItems = parseChecklistText(content.checklistText);

  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="split align-start">
          <div>
            <div className="section-header faq-section-header">
              <p className="eyebrow">{content.eyebrow}</p>
              <h2>{content.title}</h2>
            </div>
            <div className="accordion">
              {items.map((item, index) => (
                <details key={`${item.question}-${index}`}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
            {content.closing ? <p>{content.closing}</p> : null}
          </div>
          <aside className="checklist">
            <p className="eyebrow">{content.checklistEyebrow}</p>
            <h2>{content.checklistTitle}</h2>
            {checklistItems.map((item, index) => (
              <div key={`${item.title}-${index}`} className="check-item">
                <span>✓</span>
                <p>
                  <strong>{item.title}</strong>
                  <br />
                  {item.description}
                </p>
              </div>
            ))}
          </aside>
        </div>
        <div className="faq-final-action">
          <a className={buttonClass(button)} href={resolveTemplate(button.url, project)}>
            <WhatsappIcon />
            <span>{button.label}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default FaqPreview;
