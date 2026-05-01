import { LucideIcon } from "../../preview/previewIcons.jsx";

export function ProblemsPreview({ section }) {
  const content = section.content;

  return (
    <section className="section section-light problem-section" id="problemas">
      <div className="container">
        <div className="problem-header">
          <h2>{content.title}</h2>
          <p className="eyebrow">{content.eyebrow}</p>
          <p className="intro">{content.intro}</p>
        </div>
        <div className="card-grid two-col">
          {(content.cards || []).map((card) => (
            <article key={card.title} className={`info-card ${card.highlight ? "highlight" : ""}`}>
              <div className="card-icon">
                <LucideIcon name={card.icon} />
              </div>
              <h3>{card.title}</h3>
              <ul>
                {(card.items || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProblemsPreview;
