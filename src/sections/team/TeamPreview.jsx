import { previewAsset } from "../../preview/previewUtils.js";

export function TeamPreview({ section }) {
  const content = section.content;

  return (
    <section className="section" id="equipe">
      <div className="container">
        <div className="section-header team-header">
          <h2>{content.title}</h2>
          {content.subtitle ? <p className="team-subtitle">{content.subtitle}</p> : null}
        </div>
        <div className="profile-grid">
          {(content.profiles || []).map((profile) => (
            <article key={profile.name} className="profile-card">
              <img src={previewAsset(profile.image)} alt={profile.name} />
              <div className="profile-card-footer">
                <h3>{profile.name}</h3>
                {profile.credential ? <p>{profile.credential}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TeamPreview;
