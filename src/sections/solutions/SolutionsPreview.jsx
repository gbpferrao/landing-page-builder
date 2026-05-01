import { LucideIcon } from "../../preview/previewIcons.jsx";

export function SolutionsPreview({ section }) {
  const content = section.content;

  return (
    <section className="section solutions-section" id="solucoes">
      <div className="container">
        <div className="solutions-header">
          <h2>{content.title}</h2>
          <p className="eyebrow">{content.eyebrow}</p>
        </div>
        <div className="feature-grid">
          {(content.items || []).map((item) => (
            <article key={item.title} className="feature">
              <span className="feature-icon">
                <LucideIcon name="check" />
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SolutionsPreview;
