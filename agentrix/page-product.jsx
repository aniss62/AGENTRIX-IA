// Agentrix-IA — Page Produit / Fonctionnalités
const { useState: useStateProduct, useEffect: useEffectProduct } = React;

function DashSpark() {
  const pts = [10, 22, 16, 30, 26, 40, 34, 48];
  const max = Math.max(...pts);
  const w = 260, h = 54, step = w / (pts.length - 1);
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${i * step},${h - (p / max) * h}`).join(" ");
  const area = `${path} L${w},${h} L0,${h} Z`;
  return (
    <svg className="dash-mock__spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <path d={area} fill="var(--accent-soft)" stroke="none" />
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashPreview({ label }) {
  const { t } = useT();
  const dash = t("product.dash");
  const [idx, setIdx] = useStateProduct(0);

  useEffectProduct(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => setIdx((v) => (v + 1) % dash.frames.length), 4200);
    return () => clearInterval(id);
  }, [dash.frames.length]);

  const frame = dash.frames[idx];
  const screenLabel = (i) => dash.screen.replace("{n}", i + 1).replace("{total}", dash.frames.length);

  return (
    <div className="dash-mock-wrap">
      <span className="dash-mock__ring" aria-hidden="true"></span>
      <div className="dash-mock" role="img" aria-label={label}>
        <div className="dash-mock__bar">
          <div className="dash-mock__id">
            <span className="dash-mock__dots"><span></span><span></span><span></span></span>
            <span className="dash-mock__title"><Logo size={14} />AGENTRIX-IA</span>
          </div>
          <span className="dash-mock__live">{dash.live}</span>
        </div>
        <nav className="dash-mock__nav">
          {dash.nav.map(([icon, itemLabel], i) => (
            <span key={i} className={`dash-mock__navitem${i === frame.navIdx ? " active" : ""}`}>
              <Icon name={icon} size={16} />{itemLabel}
            </span>
          ))}
        </nav>
        <div className="dash-mock__body">
          <div className="dash-mock__section-head">
            <span>{frame.title}</span>
            <span className="dash-mock__agent"><span className="dash-mock__livedot" aria-hidden="true"></span>{dash.agentActive}</span>
          </div>

          {idx === 0 && (
            <div className="dash-mock__frame">
              {dash.team.map((r, i) => (
                <div className="dash-mock__row" key={i}>
                  <span className="dash-mock__avatar">{r.init}</span>
                  <span className={`dash-mock__check${r.done ? " done" : ""}`}>
                    {r.done && <Icon name="check" size={12} />}
                  </span>
                  <span className={`dash-mock__task${r.done ? " done" : ""}`}>{r.task}</span>
                  <span className={`dash-mock__pill${r.accent ? " accent" : ""}`}>{r.tag}</span>
                </div>
              ))}
            </div>
          )}

          {idx === 1 && (
            <div className="dash-mock__frame">
              {dash.production.map((s, i) => (
                <div className="dash-mock__stage" key={i}>
                  <div className="dash-mock__stage-head">
                    <span>{s.label}</span>
                    <span>{s.pct}%</span>
                  </div>
                  <div className="dash-mock__bar-track">
                    <div className="dash-mock__bar-fill" style={{ width: `${s.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {idx === 2 && (
            <div className="dash-mock__frame">
              <div className="dash-mock__stats">
                {dash.stats.map((s, i) => (
                  <div className="dash-mock__stat" key={i}>
                    <div className="dash-mock__stat-val">{s.val}</div>
                    <div className="dash-mock__stat-lbl">{s.lbl}</div>
                  </div>
                ))}
              </div>
              <DashSpark />
            </div>
          )}

          {idx === 3 && (
            <div className="dash-mock__frame">
              {dash.alerts.map((a, i) => (
                <div className="dash-mock__alert" key={i}>
                  <span className={`dash-mock__alert-dot${a.ok ? "" : " warn"}`}></span>
                  <span className="dash-mock__alert-text">
                    {a.text}
                    <span className="dash-mock__alert-time">{a.time}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="dash-mock__dotsnav">
          {dash.frames.map((_, i) => (
            <button
              key={i}
              type="button"
              className={i === idx ? "active" : ""}
              aria-label={screenLabel(i)}
              onClick={() => setIdx(i)}
            ></button>
          ))}
        </div>
        <div className="dash-mock__foot">{dash.footer}</div>
      </div>
    </div>
  );
}

function PageProduct({ go }) {
  const { t } = useT();
  const caps = t("product.capabilities.items");
  const capIcons = ["brain", "plug", "memory", "shield", "layers", "eye"];
  const flow = t("product.flow.steps");
  const integrations = ["CRM", "Slack", "Gmail", "Notion", "HubSpot", "Airtable", "Stripe", "Sheets", "API REST", "Webhooks", "PostgreSQL", "Zapier"];

  return (
    <div className="page">
      {/* Hero + dashboard preview */}
      <section className="hero hero--inner">
        <div className="wrap">
          <div className="hero__grid">
            <div className="hero__copy">
              <Eyebrow>{t("product.hero.eyebrow")}</Eyebrow>
              <Reveal as="h1" className="h-1 mt-m">{t("product.hero.title")}</Reveal>
              <Reveal className="lead mt-s hero__sub" delay="1">{t("product.hero.sub")}</Reveal>
            </div>
            <div className="hero__visual hero__visual--wide">
              <DashPreview label={t("product.dash.label")} />
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="section section--tight">
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
