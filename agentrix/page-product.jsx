// Agentrix-IA — Page Produit / Fonctionnalités
function PageProduct({ go }) {
  const { t } = useT();
  const caps = t("product.capabilities.items");
  const capIcons = ["brain", "plug", "memory", "shield", "layers", "eye"];
  const flow = t("product.flow.steps");
  const integrations = ["CRM", "Slack", "Gmail", "Notion", "HubSpot", "Airtable", "Stripe", "Sheets", "API REST", "Webhooks", "PostgreSQL", "Zapier"];

  return (
    <div className="page">
      {/* Hero */}
      <section className="hero hero--inner hero--center">
        <div className="wrap">
          <Eyebrow>{t("product.hero.eyebrow")}</Eyebrow>
          <Reveal as="h1" className="h-1 mt-m maxw-xl">{t("product.hero.title")}</Reveal>
          <Reveal className="lead mt-s" delay="1">{t("product.hero.sub")}</Reveal>
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="section--tight">
        <div className="wrap">
          <Reveal>
            <img className="dash-img" src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&q=80&auto=format&fit=crop" alt={t("product.dash.label")} loading="lazy" />
          </Reveal>
        </div>
      </section>

      {/* Capabilities */}
      <section className="section">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>{t("product.capabilities.eyebrow")}</Eyebrow>
            <h2 className="h-1">{t("product.capabilities.title")}</h2>
          </div>
          <div className="grid cols-3">
            {caps.map((c, i) => (
              <Reveal key={i} delay={String((i % 3) + 1)}>
                <div className="card card--accent pcard" style={{ height: "100%" }}>
                  <div className="pcard__icon"><Icon name={capIcons[i]} /></div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                  <div className="pcard__line"></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Agentic loop */}
      <section className="section section--tight">
        <div className="wrap">
          <div className="shead shead--center">
            <Eyebrow>{t("product.flow.eyebrow")}</Eyebrow>
            <h2 className="h-1">{t("product.flow.title")}</h2>
          </div>
          <div className="loop">
            {flow.map((f, i) => (
              <Reveal key={i} delay={String(i + 1)} className="loop__item">
                <div className="loop__node"><span>{i + 1}</span></div>
                <h3>{f.n}</h3>
                <p>{f.desc}</p>
                {i < flow.length - 1 && <div className="loop__connector"><Icon name="arrow" size={18} /></div>}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="section section--tight">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>{t("product.integ.eyebrow")}</Eyebrow>
            <h2 className="h-1">{t("product.integ.title")}</h2>
            <p className="lead">{t("product.integ.sub")}</p>
          </div>
          <div className="integ-grid">
            {integrations.map((it, i) => (
              <Reveal key={i} delay={String((i % 5) + 1)}>
                <div className="integ-chip"><span className="integ-dot"></span>{it}</div>
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

window.PageProduct = PageProduct;
