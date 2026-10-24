// Agentrix-IA — Page Accueil
function PageHome({ go }) {
  const { t } = useT();
  const pillars = t("home.pillars.items");
  const pillarIcons = ["bolt", "target", "layout", "brain"];
  const steps = t("home.how.steps");
  const metrics = t("home.metrics.items");

  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="wrap">
          <div className="hero__grid">
            <div className="hero__copy">
              <div className="hero__badge"><Eyebrow>{t("home.hero.badge")}</Eyebrow></div>
              <Reveal as="h1" className="h-display">
                {t("home.hero.titleA")} <span className="hi">{t("home.hero.titleHi")}</span>
              </Reveal>
              <Reveal className="lead hero__sub" delay="1">{t("home.hero.sub")}</Reveal>
              <Reveal className="hero__ctas" delay="2">
                <Btn variant="primary" lg onClick={() => go("contact")} arrow>{t("home.hero.cta1")}</Btn>
                <Btn variant="ghost" lg onClick={() => go("product")}>{t("home.hero.cta2")}</Btn>
              </Reveal>
            </div>
            <div className="hero__visual">
              <AgentNetwork />
            </div>
          </div>
        </div>
      </section>

      {/* Pillars — interactive services explorer */}
      <section className="section">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>{t("home.pillars.eyebrow")}</Eyebrow>
            <h2 className="h-1">{t("home.pillars.title")}</h2>
            <p className="lead">{t("home.pillars.sub")}</p>
          </div>
          <Reveal><ServicesBento /></Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="section section--tight">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>{t("home.how.eyebrow")}</Eyebrow>
            <h2 className="h-1">{t("home.how.title")}</h2>
          </div>
          <div className="grid cols-3">
            {steps.map((s, i) => (
              <Reveal key={i} delay={String(i + 1)}>
                <div className="step">
                  <div className="step__bar"></div>
                  <span className="step__n">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="section section--tight">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>{t("home.metrics.eyebrow")}</Eyebrow>
            <h2 className="h-1">{t("home.metrics.title")}</h2>
          </div>
          <div className="grid cols-4">
            {metrics.map((m, i) => (
              <Reveal key={i} delay={String((i % 4) + 1)}>
                <div className="metric">
                  <div className="val"><CountUp value={m.value} /></div>
                  <div className="lbl">{m.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Appel à l'action : diagnostic gratuit */}
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

      {/* FAQ — explains the activity */}
      <HomeFAQ />

      {/* Inline framed chat with clickable questions */}
      <ChatSection />

      {/* Lead capture (Nom / Prénom / Email / Projet) */}
      <LeadSection />

      {/* Clients : défilement continu, carte des travaux au clic */}
      <ClientsBand />
    </div>
  );
}

window.PageHome = PageHome;
