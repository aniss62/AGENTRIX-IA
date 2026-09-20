// Agentrix-IA — Page À propos / Équipe

/* Mission illustration: an hourglass reclaiming time. Sand keeps
   draining, but three "agent" satellites around the neck actively
   catch grains before they're lost — each catch flashes the
   satellite's checkmark, so the "agents intercept the time-drain"
   idea reads directly instead of just decorating the scene. */
function MissionHourglass() {
  const sats = [
    { x: 293, y: 67, delay: 0 },
    { x: 293, y: 353, delay: -1.1 },
    { x: 45, y: 210, delay: -2.2 },
  ];
  return (
    <div className="agentnet missionclock" aria-hidden="true">
      <svg viewBox="0 0 420 420" className="agentnet__svg">
        <circle cx="210" cy="210" r="170" fill="none" stroke="var(--line-2)" strokeWidth="1" />

        <g stroke="var(--accent)" strokeWidth="1" opacity="0.4">
          {sats.map((s, i) => (
            <line key={i} className="anl" x1="210" y1="210" x2={s.x} y2={s.y} />
          ))}
        </g>

        {/* hourglass frame — symmetric curved glass, pinched at the neck (210,210) */}
        <path
          d="M150,130 L270,130
             C270,172 224,184 218,210
             C224,236 270,248 270,290
             L150,290
             C150,248 196,236 202,210
             C196,184 150,172 150,130 Z"
          fill="var(--bg-2)" stroke="var(--line-2)" strokeWidth="1.5" strokeLinejoin="round"
        />
        <line x1="144" y1="130" x2="276" y2="130" stroke="var(--text)" strokeWidth="7" strokeLinecap="round" />
        <line x1="144" y1="290" x2="276" y2="290" stroke="var(--text)" strokeWidth="7" strokeLinecap="round" />

        {/* sand — top empties, bottom fills, loops */}
        <path className="hg-sand-top" d="M162,140 L258,140 L210,206 Z" fill="var(--accent)" opacity="0.9" />
        <path className="hg-sand-bot" d="M210,214 L162,280 L258,280 Z" fill="var(--accent)" opacity="0.9" />
        <g className="hg-stream" fill="var(--accent)">
          <circle className="hg-grain" cx="209" cy="208" r="2.6" />
          <circle className="hg-grain" cx="211" cy="208" r="2.2" style={{ animationDelay: "-0.4s" }} />
          <circle className="hg-grain" cx="210" cy="208" r="2.4" style={{ animationDelay: "-0.8s" }} />
        </g>

        {/* grains the agents catch before they're lost — travel from the
            neck out to each satellite instead of falling */}
        {sats.map((s, i) => (
          <circle
            key={i} className="hg-catch" r="3" fill="var(--accent)"
            cx="210" cy="210"
            style={{ "--cx": `${s.x - 210}px`, "--cy": `${s.y - 210}px`, animationDelay: `${s.delay}s` }}
          />
        ))}

        {/* automated-task satellites */}
        {sats.map((s, i) => (
          <g key={i} className="ann hg-sat" style={{ animationDelay: `${s.delay - 2}s` }}>
            <circle className="hg-sat-ring" cx={s.x} cy={s.y} r="15" fill="var(--surface)" stroke="var(--accent)" strokeWidth="1.4" style={{ animationDelay: `${s.delay}s` }} />
            <path d={`M${s.x - 6} ${s.y}l4 4 8-8`} stroke="var(--accent)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}

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
              <MissionHourglass />
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
