// Agentrix-IA — Bandeau clients : défilement continu, chaque nom ouvre une carte
// collée au bandeau (sous le nom cliqué) avec les travaux réalisés pour ce client.
const { useState: useStateCB, useEffect: useEffectCB, useRef: useRefCB } = React;

function ClientCard({ client, anchor, onClose }) {
  const { t, lang } = useT();
  const ref = useRefCB(null);
  const works = client.works[lang] || client.works.fr;

  useEffectCB(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    const onDown = (e) => {
      if (ref.current && ref.current.contains(e.target)) return;
      if (e.target.closest && e.target.closest(".marquee__item--btn")) return;
      onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("resize", onClose);
    if (ref.current) ref.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", onClose);
    };
  }, [onClose]);

  return (
    <div className="clientcard" ref={ref} role="dialog" aria-label={client.name}
         style={{ left: anchor.left, width: anchor.width, "--arrow-x": anchor.arrow + "px" }}>
      <button className="clientcard__close" type="button" onClick={onClose} aria-label={t("home.clients.close")}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
      <div className="clientcard__eyebrow mono-tag">{t("home.clients.works")}</div>
      <h3 className="clientcard__name">{client.name}</h3>
      <ul className="clientcard__list">
        {works.map((w, i) => (
          <li key={i}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>
            <span>{w}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ClientsBand() {
  const { t } = useT();
  const clients = window.CLIENTS_DATA || [];
  const [open, setOpen] = useStateCB(null); // { client, anchor }
  const railRef = useRefCB(null);
  const close = React.useCallback(() => setOpen(null), []);
  const row = clients.concat(clients); // doublon pour une boucle continue sans saut

  const openFor = (client, e) => {
    const rail = railRef.current.getBoundingClientRect();
    const btn = e.currentTarget.getBoundingClientRect();
    const width = Math.min(420, rail.width - 24);
    const center = btn.left - rail.left + btn.width / 2;
    const left = Math.max(12, Math.min(center - width / 2, rail.width - width - 12));
    setOpen({ client, anchor: { left, width, arrow: Math.max(22, Math.min(center - left, width - 22)) } });
  };

  return (
    <div className={`logos-band ${open ? "is-paused" : ""}`}>
      <div className="wrap">
        <div className="logos-band__label mono-tag">{t("home.logos.label")}</div>
      </div>
      <div className="logos-band__rail" ref={railRef}>
        <div className="marquee">
          <div className="marquee__track">
            {row.map((c, i) => (
              <button key={i} type="button" className="marquee__item marquee__item--btn"
                      aria-haspopup="dialog" aria-hidden={i >= clients.length ? "true" : undefined}
                      tabIndex={i >= clients.length ? -1 : 0}
                      onClick={(e) => openFor(c, e)}>{c.name}</button>
            ))}
          </div>
        </div>
        {open && <ClientCard client={open.client} anchor={open.anchor} onClose={close} />}
      </div>
      <div className="logos-band__hint mono-tag">{t("home.clients.hint")}</div>
    </div>
  );
}

window.ClientsBand = ClientsBand;
