// Agentrix-IA — Bandeau clients : défilement continu, chaque nom ouvre une carte
// avec les travaux réalisés pour ce client.
const { useState: useStateCB, useEffect: useEffectCB } = React;

function ClientCard({ client, onClose, go }) {
  const { t, lang } = useT();
  const works = (client.works[lang] || client.works.fr);
  const hasTestimonial = (window.TESTIMONIALS || []).some((q) => q.company === client.name);

  useEffectCB(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="clientcard__backdrop" onClick={onClose}>
      <div className="clientcard" role="dialog" aria-modal="true" aria-label={client.name} onClick={(e) => e.stopPropagation()}>
        <button className="clientcard__close" type="button" onClick={onClose} aria-label={t("home.clients.close")} autoFocus>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
        <Eyebrow>{t("home.clients.works")}</Eyebrow>
        <h3 className="clientcard__name">{client.name}</h3>
        <ul className="clientcard__list">
          {works.map((w, i) => (
            <li key={i}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>
              <span>{w}</span>
            </li>
          ))}
        </ul>
        {hasTestimonial && (
          <a className="clientcard__link" href={routeHref("testimonials")}
             onClick={(e) => { e.preventDefault(); onClose(); go("testimonials"); }}>
            {t("home.clients.testimonial")} <span className="arr">→</span>
          </a>
        )}
      </div>
    </div>
  );
}

function ClientsBand({ go }) {
  const { t } = useT();
  const clients = window.CLIENTS_DATA || [];
  const [open, setOpen] = useStateCB(null);
  const close = React.useCallback(() => setOpen(null), []);
  const row = clients.concat(clients); // doublon pour une boucle continue sans saut

  return (
    <div className={`logos-band ${open ? "is-paused" : ""}`}>
      <div className="wrap">
        <div className="logos-band__label mono-tag">{t("home.logos.label")}</div>
      </div>
      <div className="marquee">
        <div className="marquee__track">
          {row.map((c, i) => (
            <button key={i} type="button" className="marquee__item marquee__item--btn"
                    aria-haspopup="dialog" aria-hidden={i >= clients.length ? "true" : undefined}
                    tabIndex={i >= clients.length ? -1 : 0}
                    onClick={() => setOpen(c)}>{c.name}</button>
          ))}
        </div>
      </div>
      <div className="logos-band__hint mono-tag">{t("home.clients.hint")}</div>
      {open && <ClientCard client={open} onClose={close} go={go} />}
    </div>
  );
}

window.ClientsBand = ClientsBand;
