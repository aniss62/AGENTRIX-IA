// Agentrix-IA — Services bento grid (hybrid: visual cards + metric badge + expandable checklist)
function SvcOrb({ size = 22 }) {
  return <span className="svcb__orb" style={{ width: size, height: size }}></span>;
}

function SvcCardShell({ className = "", art, title, desc, metric, points }) {
  const { t } = useT();
  const [open, setOpen] = React.useState(false);
  return (
    <div
      className={`svcb__card ${className} ${open ? "open" : ""}`}
      onClick={() => setOpen((o) => !o)}
      role="button" tabIndex={0} aria-expanded={open}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((o) => !o); } }}
    >
      <div className="svcb__metric">
        <CountUp value={metric.value} />
        <small>{metric.label}</small>
      </div>
      <div className="svcb__art">{art}</div>
      <div className="svcb__body">
        <h3 className="svcb__title">{title}</h3>
        <p className="svcb__desc">{desc}</p>
        <div className="svcb__toggle" aria-expanded={open}>
          <span className="svcb__toggle-label">{t("home.pillars.included")}</span>
          {open ? (
            <button
              className="svcb__minus"
              aria-label={t("home.pillars.less")}
              onClick={(e) => { e.stopPropagation(); setOpen(false); }}
            >
              <Icon name="minus" size={13} />
            </button>
          ) : (
            <span className="svcb__toggle-ic"><Icon name="plus" size={14} /></span>
          )}
        </div>
        <div className="svcb__points">
          <div className="svcb__points-inner">
            {points.map((pt, j) => (
              <div key={j} className="svcb__point"><Icon name="check" size={13} />{pt}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServicesBento() {
  const { t } = useT();
  const items = t("home.pillars.items");
  const [a, b, c, d] = items;

  return (
    <div className="svcb">
      <SvcCardShell
        className="svcb__card--wide"
        title={a.title} desc={a.desc} metric={a.metric} points={a.points}
        art={
          <div className="svcb__scene">
            <div className="svcb__chip svcb__chip--ghost svcb__chip--1">
              <span className="svcb__chip-dot"></span>{t("home.chat.status")}
            </div>
            <div className="svcb__chip svcb__chip--2">
              <Icon name="check" size={13} />Relance envoyée
            </div>
            <svg className="svcb__wire" viewBox="0 0 200 90" aria-hidden="true">
              <path d="M20 70 Q90 70 120 30" />
            </svg>
          </div>
        }
      />
      <SvcCardShell
        title={d.title} desc={d.desc} metric={d.metric} points={d.points}
        art={
          <div className="svcb__scene svcb__scene--chat">
            <div className="svcb__chip svcb__chip--bot">
              <SvcOrb size={20} /><span>{t("home.chat.welcome").slice(0, 28)}…</span>
            </div>
            <div className="svcb__inputbar"><span>{t("home.chat.inputPlaceholder")}</span><Icon name="send" size={13} /></div>
          </div>
        }
      />
      <SvcCardShell
        title={b.title} desc={b.desc} metric={b.metric} points={b.points}
        art={
          <div className="svcb__scene svcb__scene--leads">
            <div className="svcb__chip svcb__chip--ghost svcb__chip--lead2">
              <span className="svcb__avatar" data-tone="b">MJ</span>Martin Jaguar
            </div>
            <div className="svcb__chip svcb__chip--lead1">
              <span className="svcb__avatar" data-tone="a">JR</span>Jane Rosalyne
              <span className="svcb__qualified"><Icon name="check" size={11} /></span>
            </div>
          </div>
        }
      />
      <SvcCardShell
        className="svcb__card--wide"
        title={c.title} desc={c.desc} metric={c.metric} points={c.points}
        art={
          <div className="svcb__scene svcb__scene--browser">
            <div className="svcb__browser">
              <div className="svcb__browser-bar"><span></span><span></span><span></span></div>
              <div className="svcb__browser-body">
                <span className="svcb__browser-line"></span>
                <span className="svcb__browser-line svcb__browser-line--sm"></span>
                <span className="svcb__browser-cta">{t("common.getStarted")} →</span>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}

window.ServicesBento = ServicesBento;
