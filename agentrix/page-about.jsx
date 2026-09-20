// Agentrix-IA — Page À propos / Équipe

/* Mission illustration: a clock reclaiming time, with automated tasks
   (checkmarked satellites) orbiting it — reuses the homepage's orbit
   animation classes (.ann/.anl/.anpulse) for a consistent feel. */
function MissionClock() {
  return (
    <div className="agentnet missionclock" aria-hidden="true">
      <svg viewBox="0 0 420 420" className="agentnet__svg">
        <circle cx="210" cy="210" r="170" fill="none" stroke="var(--line-2)" strokeWidth="1" />

        <g stroke="var(--accent)" strokeWidth="1" opacity="0.4">
          <line className="anl" x1="210" y1="210" x2="293" y2="67" />
          <line className="anl" x1="210" y1="210" x2="293" y2="353" />
          <line className="anl" x1="210" y1="210" x2="45" y2="210" />
        </g>

        {/* clock face + "time reclaimed" arc */}
        <circle cx="210" cy="210" r="108" fill="var(--bg-2)" stroke="var(--line-2)" strokeWidth="1.5" />
        <circle
          cx="210" cy="210" r="108" fill="none" stroke="var(--accent)" strokeWidth="4"
          strokeLinecap="round" strokeDasharray="220 900" transform="rotate(-95 210 210)" opacity="0.9"
        />
        <line x1="210" y1="210" x2="210" y2="145" stroke="var(--text)" strokeWidth="5" strokeLinecap="round" />
        <line x1="210" y1="210" x2="258" y2="182" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" />
        <circle cx="210" cy="210" r="7" fill="var(--text)" />

        {/* automated-task satellites */}
        <g className="ann">
          <circle cx="293" cy="67" r="15" fill="var(--surface)" stroke="var(--accent)" strokeWidth="1.4" />
          <path d="M287 67l4 4 8-8" stroke="var(--accent)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g className="ann" style={{ animationDelay: "-2s" }}>
          <circle cx="293" cy="353" r="15" fill="var(--surface)" stroke="var(--accent)" strokeWidth="1.4" />
          <path d="M287 353l4 4 8-8" stroke="var(--accent)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g className="ann" style={{ animationDelay: "-4s" }}>
          <circle cx="45" cy="210" r="15" fill="var(--surface)" stroke="var(--accent)" strokeWidth="1.4" />
          <path d="M39 210l4 4 8-8" stroke="var(--accent)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        <circle className="anpulse" cx="210" cy="210" r="12" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

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
      <section className="section section--tight">
        <div className="wrap">
          <div className="story">
            <div className="story__left">
              <Eyebrow>{t("about.story.eyebrow")}</Eyebrow>
              <Reveal as="h2" className="h-2 mt-s">{t("about.story.title")}</Reveal>
              <Reveal className="lead mt-m" delay="1">{t("about.story.body")}</Reveal>
            </div>
            <Reveal className="story__right" delay="1">
              <MissionClock />
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
