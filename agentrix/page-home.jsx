// Agentrix-IA — Page Accueil
function PageHome({ go }) {
  const { t } = useT();
  const pillars = t("home.pillars.items");
  const pillarIcons = ["bolt", "target", "layout", "brain"];
  const steps = t("home.how.steps");
  const metrics = t("home.metrics.items");
  const logos = ["Northwind", "Lumio", "Helios", "Atelier Vert", "Brightpath", "Vela"];

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
              <Reveal className="hero__stats" delay="3">
                <div className="hero__stat"><div className="num"><CountUp value="18h" /></div><div className="lbl">{t("home.hero.s1")}</div></div>
                <div className="hero__stat"><div className="num"><CountUp value="120+" /></div><div className="lbl">{t("home.hero.s2")}</div></div>
                <div className="hero__stat"><div className="num"><CountUp value="92%" /></div><div className="lbl">{t("home.hero.s3")}</div></div>
              </Reveal>
            </div>
            <div className="hero__visual">
              <AgentNetwork />
            </div>
          </div>
        </div>
      </section>

      {/* Logos marquee */}
      <div className="logos-band">
        <div className="wrap">
          <div className="logos-band__label mono-tag">{t("home.logos.label")}</div>
        </div>
        <Marquee items={logos} />
      </div>

      {/* Pillars — interactive services explorer */}
      <section className="section">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>{t("home.pillars.eyebrow")}</Eyebrow>
            <h2 className="h-1">{t("home.pillars.title")}</h2>
            <p className="lead">{t("home.pillars.sub")}</p>
          </div>
          <Reveal><ServicesExplorer /></Reveal>
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

      {/* Testimonials with photos */}
      <HomeTestimonials go={go} />

      {/* FAQ — explains the activity */}
      <HomeFAQ />

      {/* Inline framed chat with clickable questions */}
      <ChatSection />

      {/* Lead capture (Nom / Prénom / Email / Projet) */}
      <LeadSection />
    </div>
  );
}

window.PageHome = PageHome;
