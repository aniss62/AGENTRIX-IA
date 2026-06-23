// Agentrix-IA — Page À propos / Équipe
function PageAbout({ go }) {
  const { t } = useT();
  const values = t("about.values.items");
  const valIcons = ["shield", "target", "eye", "spark"];
  const team = t("about.team.members");
  const initials = (name) => name.split(/\s+/).slice(0, 2).map(w => w[0]).join("");

  return (
    <div className="page">
      <section className="hero hero--inner hero--center">
        <div className="wrap">
          <Eyebrow>{t("about.hero.eyebrow")}</Eyebrow>
          <Reveal as="h1" className="h-1 mt-m maxw-xl">{t("about.hero.title")}</Reveal>
          <Reveal className="lead mt-s" delay="1">{t("about.hero.sub")}</Reveal>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="wrap">
          <div className="story">
            <div className="story__left">
              <Eyebrow>{t("about.story.eyebrow")}</Eyebrow>
              <Reveal as="h2" className="h-2 mt-s">{t("about.story.title")}</Reveal>
            </div>
            <Reveal className="story__right" delay="1">
              <p className="lead">{t("about.story.body")}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section section--tight">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>{t("about.values.eyebrow")}</Eyebrow>
            <h2 className="h-1">{t("about.values.title")}</h2>
          </div>
          <div className="grid cols-4">
            {values.map((v, i) => (
              <Reveal key={i} delay={String((i % 4) + 1)}>
                <div className="card card--accent pcard" style={{ height: "100%" }}>
                  <div className="pcard__icon"><Icon name={valIcons[i]} /></div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                  <div className="pcard__line"></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section section--tight">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>{t("about.team.eyebrow")}</Eyebrow>
            <h2 className="h-1">{t("about.team.title")}</h2>
          </div>
          <div className="grid cols-4">
            {team.map((m, i) => (
              <Reveal key={i} delay={String((i % 4) + 1)}>
                <div className="member">
                  <div className="member__photo">
                    <img className="member__img" src={window.TEAM_PHOTOS[i]} alt={m.name} loading="lazy" />
                  </div>
                  <div className="member__name">{m.name}</div>
                  <div className="member__role">{m.role}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--tight">
        <div className="wrap">
          <Reveal>
            <div className="ctaband">
              <div className="ctaband__inner">
                <h2 className="h-1">{t("home.cta.title")}</h2>
                <p className="lead">{t("home.cta.sub")}</p>
                <Btn variant="primary" lg onClick={() => go("contact")} arrow>{t("home.cta.btn")}</Btn>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

window.PageAbout = PageAbout;
