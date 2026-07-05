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
          <Reveal>
            <div className="ceo">
              <div className="ceo__photo">
                <img className="ceo__img" src={window.TEAM_PHOTOS[0]} alt={team[0].name} loading="lazy" />
              </div>
              <div className="ceo__body">
                <svg className="ceo__quote" width="34" height="26" viewBox="0 0 34 26" fill="none"><path d="M14.5 0C6.5 3 0 10 0 17.5 0 22.5 3.6 26 8.3 26c4.3 0 7.7-3.4 7.7-7.6 0-4-2.8-7-6.6-7.4C10.5 6.7 14 3.2 18 1.4L14.5 0zM32.5 0c-8 3-14.5 10-14.5 17.5 0 5 3.6 8.5 8.3 8.5 4.3 0 7.7-3.4 7.7-7.6 0-4-2.8-7-6.6-7.4C28.5 6.7 32 3.2 36 1.4L32.5 0z" fill="currentColor"/></svg>
                <p className="ceo__note">{t("about.team.ceoNote")}</p>
                <div className="ceo__name">{team[0].name}</div>
                <div className="ceo__role">{team[0].role}</div>
              </div>
            </div>
          </Reveal>
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
