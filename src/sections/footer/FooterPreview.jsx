import { InstagramIcon, LucideIcon, WhatsappIcon } from "../../preview/previewIcons.jsx";
import { previewAsset, resolveTemplate } from "../../preview/previewUtils.js";

export function FooterPreview({ project }) {
  const brand = project.site.brand;
  const footer = project.site.footer;

  return (
    <>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <img className="footer-logo" src={previewAsset(brand.logo)} alt={brand.name} />
          </div>
          <nav>
            <h3>Menu</h3>
            {(footer.menu || []).map((item) => (
              <a key={item.url} href={item.url}>{item.label}</a>
            ))}
          </nav>
          <div>
            <h3>Localizacao</h3>
            <p className="footer-contact-item">
              <LucideIcon name="map-pin" />
              <span>{footer.address}</span>
            </p>
          </div>
          <div>
            <h3>Contato</h3>
            <p className="footer-contact-item">
              <LucideIcon name="phone" />
              <a href={`tel:${footer.phone}`}>{footer.phone}</a>
            </p>
            <p className="footer-contact-item">
              <LucideIcon name="mail" />
              <a href={`mailto:${footer.email}`}>{footer.email}</a>
            </p>
            <p className="footer-contact-item">
              <InstagramIcon />
              <a href={footer.instagram}>{footer.instagramHandle}</a>
            </p>
          </div>
        </div>
        <div className="copyright">{footer.copyright}</div>
      </footer>
      <a
        className="whatsapp-float"
        href={resolveTemplate(brand.whatsappUrl, project)}
        aria-label="Abrir WhatsApp"
      >
        <WhatsappIcon />
      </a>
    </>
  );
}

export default FooterPreview;
