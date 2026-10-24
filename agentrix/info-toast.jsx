// Agentrix-IA — Bulle d'information (remplace les anciennes notifications d'activité fictives).
// N'affiche que des informations vraies et permanentes : le diagnostic gratuit, le rappel sous 24 h
// et le dernier article du blog (window.LATEST_POST, injecté au build depuis blog/index.html).
const INFO_TOAST_GATE_KEY = "agentrix_cookie_consent";
const INFO_TOAST_START_MS = 4000;
const INFO_TOAST_VISIBLE_MS = 7000;
const INFO_TOAST_GAP_MS = 5000;

function InfoToast({ route, go }) {
  const { t } = useT();
  const [gateOpen, setGateOpen] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [idx, setIdx] = React.useState(0);

  const post = window.LATEST_POST;
  const items = [
    { text: t("infoToast.diag.text"), sub: t("infoToast.diag.sub"), cta: t("infoToast.diag.cta"), to: "contact" },
    { text: t("infoToast.call.text"), sub: t("infoToast.call.sub"), cta: t("infoToast.call.cta"), to: "contact" }
  ];
  if (post && post.title && post.url) {
    items.splice(1, 0, { text: post.title, sub: t("infoToast.post.sub"), cta: t("infoToast.post.cta"), href: post.url });
  }

  // Attendre que la bannière cookies soit traitée, pour ne jamais les superposer
  React.useEffect(() => {
    const check = () => { try { return !!localStorage.getItem(INFO_TOAST_GATE_KEY); } catch (e) { return false; } };
    if (check()) { setGateOpen(true); return; }
    const iv = setInterval(() => { if (check()) { setGateOpen(true); clearInterval(iv); } }, 1000);
    return () => clearInterval(iv);
  }, []);

  const hidden = route === "contact";
  React.useEffect(() => {
    if (!gateOpen || hidden) { setVisible(false); return; }
    let cancelled = false;
    const timers = [];
    const schedule = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); };
    let n = 0;
    const showNext = () => {
      if (cancelled) return;
      const count = (window.LATEST_POST && window.LATEST_POST.title && window.LATEST_POST.url) ? 3 : 2;
      setIdx(n % count);
      n += 1;
      setVisible(true);
      schedule(() => { setVisible(false); schedule(showNext, INFO_TOAST_GAP_MS); }, INFO_TOAST_VISIBLE_MS);
    };
    schedule(showNext, INFO_TOAST_START_MS);
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [gateOpen, hidden]);

  if (!gateOpen || hidden) return null;
  const item = items[idx % items.length];
  const onCta = (e) => {
    if (item.to) { e.preventDefault(); setVisible(false); go(item.to); }
  };

  return (
    <div className={`socialproof ${visible ? "show" : ""}`} role="status" aria-live="polite">
      <span className="socialproof__dot"></span>
      <div className="socialproof__body">
        <p className="socialproof__text"><strong>{item.text}</strong></p>
        <span className="socialproof__sub">{item.sub}</span>
        <a className="socialproof__cta" href={item.href || routeHref(item.to)} onClick={onCta}>{item.cta} <span className="arr">→</span></a>
      </div>
      <button className="socialproof__close" aria-label={t("infoToast.close")} onClick={() => setVisible(false)}>
        <Icon name="close" size={12} />
      </button>
    </div>
  );
}

window.InfoToast = InfoToast;
