import { LucideIcon } from "../../preview/previewIcons.jsx";
import { previewAsset, ratingStars } from "../../preview/previewUtils.js";

export function TestimonialsPreview({ section }) {
  const content = section.content;
  const googleLogo = section.assets?.googleLogo || "assets/defaults/google-logo.png";

  return (
    <section className="section section-dark testimonials-section" id="depoimentos">
      <div className="container">
        <h2>{content.title}</h2>
        <div className="review-carousel" data-review-carousel>
          <button className="review-carousel-button review-carousel-button-prev" type="button" aria-label="Depoimento anterior" data-review-prev="">
            <LucideIcon name="chevron-left" />
          </button>
          <div className="review-carousel-viewport">
            <div className="review-grid" data-review-track="">
              {(content.reviews || []).map((review, index) => (
                <article key={`${review.name || "review"}-${index}`} className="review-card">
                  <div className="review-topline">
                    <ReviewIdentity review={review} />
                    <span className="review-google">
                      <img className="google-logo-img" src={previewAsset(googleLogo)} alt="Google" />
                    </span>
                  </div>
                  <div className="review-meta">
                    <span className="stars" aria-label={`${review.rating || 5} estrelas`}>
                      {ratingStars(review.rating)}
                    </span>
                    <span className="verified-badge" aria-label="Verificado">✓</span>
                  </div>
                  <p>{review.text}</p>
                  <a className="review-more" href={content.readMoreUrl} target="_blank" rel="noopener noreferrer">
                    {content.readMoreLabel}
                  </a>
                </article>
              ))}
            </div>
          </div>
          <button className="review-carousel-button review-carousel-button-next" type="button" aria-label="Proximo depoimento" data-review-next="">
            <LucideIcon name="chevron-right" />
          </button>
        </div>
        {content.disclaimer ? <p className="disclaimer">{content.disclaimer}</p> : null}
      </div>
    </section>
  );
}

function ReviewIdentity({ review }) {
  const hasIdentity = Boolean(review.image || review.name || review.date);
  if (!hasIdentity) {
    return null;
  }

  return (
    <div className="review-identity">
      {review.image ? (
        <img className="review-avatar" src={previewAsset(review.image)} alt={review.name ? `Foto de ${review.name}` : ""} />
      ) : review.name ? (
        <span className="review-avatar review-avatar-fallback" aria-hidden="true">{reviewInitials(review.name)}</span>
      ) : null}
      {review.name || review.date ? (
        <div>
          {review.name ? <h3>{review.name}</h3> : null}
          {review.date ? <p className="review-date">{review.date}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function reviewInitials(name) {
  return String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default TestimonialsPreview;
