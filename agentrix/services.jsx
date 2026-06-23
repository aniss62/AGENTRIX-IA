// Agentrix-IA — Interactive services explorer (developed pillars section)
const { useState: useStateSvc } = React;

function ServicesExplorer() {
  const { t } = useT();
  const items = t("home.pillars.items");
  const icons = ["bolt", "target", "layout", "brain"];
  const [active, setActive] = useStateSvc(0);
  const cur = items[active] || items[0];

  return (
    <div className="svc">
      {/* Selector list */}
      <div className="svc__tabs" role="tablist">
        {items.map((p, i) => (
          <button key={i} role="tab" aria-selected={i === active}
            className={`svc__tab ${i === active ? "active" : ""}`}
            onClick={() => setActive(i)}>
            <span className="svc__tab-ic"><Icon name={icons[i]} size={20} /></span>
            <span className="svc__tab-txt">
              <span className="svc__tab-tag">{p.tag}</span>
              <span className="svc__tab-title">{p.title}</span>
            </span>
            <span className="svc__tab-arrow"><Icon name="arrow" size={16} /></span>
            <span className="svc__tab-bar"></span>
          </button>
        ))}
      </div>

      {/* Detail panel (re-mounts on change to replay the entrance) */}
      <div className="svc__panel" key={active}>
        <div className="svc__panel-glow"></div>
        <div className="svc__panel-head">
          <span className="svc__panel-ic"><Icon name={icons[active]} size={26} /></span>
          <div>
            <div className="pcard__tag">{cur.tag}</div>
            <h3 className="h-2 svc__panel-title">{cur.title}</h3>
          </div>
        </div>

        <p className="lead svc__panel-long">{cur.long}</p>

        <div className="svc__included mono-tag">{t("home.pillars.included")}</div>
        <div className="svc__points">
          {cur.points.map((pt, j) => (
            <div key={j} className="svc__point" style={{ transitionDelay: `${0.05 * j + 0.1}s` }}>
              <span className="svc__point-check"><Icon name="check" size={14} /></span>{pt}
            </div>
          ))}
        </div>

        <div className="svc__metric">
          <span className="svc__metric-val"><CountUp value={cur.metric.value} /></span>
          <span className="svc__metric-lbl">{cur.metric.label}</span>
        </div>
      </div>
    </div>
  );
}

window.ServicesExplorer = ServicesExplorer;
