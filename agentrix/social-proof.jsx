// Agentrix-IA — Social proof toast (rotating activity notifications)
const SOCIAL_PROOF_GATE_KEY = "agentrix_cookie_consent";
const SOCIAL_PROOF_VISIBLE_MS = 5500;
const SOCIAL_PROOF_GAP_MS = 8000;
const SOCIAL_PROOF_START_DELAY_MS = 4000;

function shuffleIndices(n) {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function SocialProof() {
  const { t } = useT();
  const items = t("socialProof.items");
  const times = t("socialProof.times");
  const [gateOpen, setGateOpen] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [idx, setIdx] = React.useState(0);
  const [timeIdx, setTimeIdx] = React.useState(0);
  const queueRef = React.useRef([]);
  const posRef = React.useRef(0);

  // Wait until the cookie banner has been resolved, so the two never overlap
  React.useEffect(() => {
    const check = () => {
      try { return !!localStorage.getItem(SOCIAL_PROOF_GATE_KEY); } catch (e) { return false; }
    };
    if (check()) { setGateOpen(true); return; }
    const iv = setInterval(() => { if (check()) { setGateOpen(true); clearInterval(iv); } }, 1000);
    return () => clearInterval(iv);
  }, []);

  React.useEffect(() => {
    if (!gateOpen || !items || !items.length) return;
    let cancelled = false;
    const timers = [];
    const schedule = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); };

    const showNext = () => {
      if (cancelled) return;
      if (posRef.current >= queueRef.current.length) {
        queueRef.current = shuffleIndices(items.length);
        posRef.current = 0;
      }
      setIdx(queueRef.current[posRef.current]);
      posRef.current += 1;
      if (times && times.length) setTimeIdx(Math.floor(Math.random() * times.length));
      setVisible(true);
      schedule(() => {
        setVisible(false);
        schedule(showNext, SOCIAL_PROOF_GAP_MS);
      }, SOCIAL_PROOF_VISIBLE_MS);
    };

    schedule(showNext, SOCIAL_PROOF_START_DELAY_MS);
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [gateOpen, items]);

  if (!gateOpen || !items || !items.length) return null;
  const item = items[idx];

  return (
    <div className={`socialproof ${visible ? "show" : ""}`} role="status" aria-live="polite">
      <span className="socialproof__dot"></span>
      <div className="socialproof__body">
        <p className="socialproof__text">{t("socialProof.lead")} <strong>{item.city}</strong> {t("socialProof.verb")} {item.activity}.</p>
        <span className="socialproof__time">{times && times[timeIdx]}</span>
      </div>
      <button className="socialproof__close" aria-label="Close" onClick={() => setVisible(false)}>
        <Icon name="close" size={12} />
      </button>
    </div>
  );
}

window.SocialProof = SocialProof;
