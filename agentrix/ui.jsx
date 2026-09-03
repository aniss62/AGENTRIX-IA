// Agentrix-IA — Shared UI
const { useRef, useEffect } = React;

/* --- Photos (web placeholders — Unsplash CDN; replace with your own later) --- */
const _U = (id, w, h) => `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&crop=faces&auto=format&q=80`;
window.PERSON_PHOTOS = [
  _U("photo-1494790108377-be9c29b29330", 760, 560),
  _U("photo-1507003211169-0a1dd7228f2d", 760, 560),
  _U("photo-1573497019940-1c28c88b4f3e", 760, 560),
  _U("photo-1500648767791-00dcc994a43e", 760, 560),
  _U("photo-1544005313-94ddf0286df2", 760, 560),
  _U("photo-1472099645785-5658abf4ff4e", 760, 560),
];
window.TEAM_PHOTOS = [
  window.TEAM_ANISS_PHOTO,
  _U("photo-1517841905240-472988babdf9", 600, 680),
  _U("photo-1519085360753-af0119f7cbe7", 600, 680),
  _U("photo-1534528741775-53994a69daeb", 600, 680),
];

/* --- Scroll reveal --- */
function Reveal({ children, delay, as, className = "", style }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { el.classList.add("in"); return; }

    let done = false;
    let io = null;
    const cleanup = () => {
      if (io) io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    const reveal = () => { if (!done) { done = true; el.classList.add("in"); cleanup(); } };
    const inView = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.94 && r.bottom > 0;
    };
    const onScroll = () => { if (inView()) reveal(); };

    if (inView()) { void el.offsetHeight; el.classList.add("in"); done = true; return cleanup; }

    io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) reveal(); });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const safety = setTimeout(() => { if (!done && inView()) reveal(); }, 1400);
    return () => { clearTimeout(safety); cleanup(); };
  }, []);
  const Tag = as || "div";
  return React.createElement(Tag, { ref, className: `reveal ${className}`, "data-d": delay, style }, children);
}

/* --- Icons (minimal geometric) --- */
function Icon({ name, size = 22 }) {
  const s = { width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", viewBox: "0 0 24 24" };
  const paths = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    check: <path d="M4 12.5l5 5L20 6.5" />,
    bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
    grid: <g><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></g>,
    target: <g><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.4"/></g>,
    layout: <g><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/></g>,
    brain: <g><circle cx="12" cy="12" r="8"/><path d="M12 6v12M8.5 8.5l7 7M15.5 8.5l-7 7"/></g>,
    plug: <path d="M9 2v6M15 2v6M7 8h10v3a5 5 0 01-10 0V8zM12 16v6" />,
    memory: <g><rect x="4" y="6" width="16" height="12" rx="2"/><path d="M8 6V3M16 6V3M8 21v-3M16 21v-3"/></g>,
    shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />,
    layers: <g><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/></g>,
    eye: <g><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="2.6"/></g>,
    mail: <g><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></g>,
    clock: <g><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></g>,
    spark: <path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" />,
    plus: <path d="M12 5v14M5 12h14" />,
    chat: <path d="M4 5.5h16v11H9l-4 3.5v-3.5H4v-11z" />,
    close: <path d="M6 6l12 12M18 6L6 18" />,
    user: <g><circle cx="12" cy="8.5" r="3.4"/><path d="M5.5 20a6.5 6.5 0 0113 0"/></g>,
    send: <path d="M4 12l16-7-7 16-2.5-6.5L4 12z" />,
    phone: <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2.2 2A16.5 16.5 0 014.5 5.7 2 2 0 016.5 3.5z" />,
    pin: <g><path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></g>
  };
  return <svg {...s}>{paths[name] || paths.spark}</svg>;
}

/* --- Animated logo mark --- */
function Logo({ size = 26 }) {
  return (
    <span className="logo" aria-hidden="true" style={{ width: size, height: size }}>
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <circle cx="16" cy="16" r="14" fill="none" stroke="var(--accent)" strokeWidth="1.4" opacity="0.5"/>
        <circle cx="16" cy="16" r="4.6" fill="var(--accent)"/>
        <circle cx="16" cy="3" r="2.1" fill="var(--accent)"/>
        <circle cx="27.3" cy="22" r="2.1" fill="var(--accent)"/>
        <circle cx="4.7" cy="22" r="2.1" fill="var(--accent)"/>
        <path d="M16 16L16 3M16 16l11.3 6M16 16L4.7 22" stroke="var(--accent)" strokeWidth="1.1" opacity="0.55"/>
      </svg>
    </span>
  );
}

function Wordmark() {
  return (
    <span className="wordmark">
      <Logo size={24} />
      <span>Agentrix<span className="accent">·IA</span></span>
    </span>
  );
}

/* --- Button --- */
function Btn({ children, variant = "primary", lg, onClick, href, arrow }) {
  const cls = `btn btn--${variant}${lg ? " btn--lg" : ""}`;
  const inner = <>{children}{arrow && <span className="arr"><Icon name="arrow" size={17} /></span>}</>;
  if (href) return <a className={cls} href={href} onClick={onClick}>{inner}</a>;
  return <button className={cls} onClick={onClick}>{inner}</button>;
}

/* --- Eyebrow --- */
function Eyebrow({ children }) { return <span className="eyebrow">{children}</span>; }

/* --- Count-up on reveal --- */
function CountUp({ value }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const m = String(value).match(/([\d.,]+)/);
    if (!m) { el.textContent = value; return; }
    const numStr = m[1];
    const isComma = numStr.includes(",") && !numStr.includes(".");
    const target = parseFloat(numStr.replace(/\s/g, "").replace(",", "."));
    const prefix = value.slice(0, m.index);
    const suffix = value.slice(m.index + m[1].length);
    const decimals = (numStr.split(/[.,]/)[1] || "").length;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { el.textContent = value; return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(el);
        const dur = 1300, t0 = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          let cur = (target * eased).toFixed(decimals);
          if (isComma) cur = cur.replace(".", ",");
          el.textContent = prefix + cur + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = value;
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return <span ref={ref}>{value}</span>;
}

/* --- Placeholder (striped) --- */
function Ph({ label, h = 220, style }) {
  return <div className="ph" style={{ height: h, ...style }}><span>{label}</span></div>;
}

/* --- Marquee --- */
function Marquee({ items }) {
  const row = items.concat(items);
  return (
    <div className="marquee">
      <div className="marquee__track">
        {row.map((it, i) => <span key={i} className="marquee__item">{it}</span>)}
      </div>
    </div>
  );
}

/* --- Animated agent network (hero visual) — geometric only --- */
function AgentNetwork() {
  return (
    <div className="agentnet" aria-hidden="true">
      <svg viewBox="0 0 420 420" className="agentnet__svg">
        <defs>
          <radialGradient id="nodeg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.2"/>
          </radialGradient>
        </defs>
        {/* orbit rings */}
        <circle cx="210" cy="210" r="170" fill="none" stroke="var(--line-2)" strokeWidth="1"/>
        <circle cx="210" cy="210" r="115" fill="none" stroke="var(--line-2)" strokeWidth="1"/>
        <circle cx="210" cy="210" r="60" fill="none" stroke="var(--line-2)" strokeWidth="1"/>
        {/* links */}
        <g stroke="var(--accent)" strokeWidth="1" opacity="0.4">
          <line className="anl" x1="210" y1="210" x2="210" y2="40"/>
          <line className="anl" x1="210" y1="210" x2="372" y2="262"/>
          <line className="anl" x1="210" y1="210" x2="78" y2="320"/>
          <line className="anl" x1="210" y1="210" x2="338" y2="118"/>
          <line className="anl" x1="210" y1="210" x2="92" y2="120"/>
        </g>
        {/* satellite nodes */}
        <g className="ann"><circle cx="210" cy="40" r="9" fill="url(#nodeg)"/></g>
        <g className="ann" style={{ animationDelay: "-1.4s" }}><circle cx="372" cy="262" r="7" fill="url(#nodeg)"/></g>
        <g className="ann" style={{ animationDelay: "-2.6s" }}><circle cx="78" cy="320" r="8" fill="url(#nodeg)"/></g>
        <g className="ann" style={{ animationDelay: "-0.8s" }}><circle cx="338" cy="118" r="6" fill="url(#nodeg)"/></g>
        <g className="ann" style={{ animationDelay: "-3.2s" }}><circle cx="92" cy="120" r="6.5" fill="url(#nodeg)"/></g>
        {/* core */}
        <circle cx="210" cy="210" r="34" fill="var(--accent-soft)"/>
        <circle cx="210" cy="210" r="20" fill="var(--accent)"/>
        <circle className="anpulse" cx="210" cy="210" r="20" fill="none" stroke="var(--accent)" strokeWidth="1.5"/>
      </svg>
    </div>
  );
}

Object.assign(window, { Reveal, Icon, Logo, Wordmark, Btn, Eyebrow, CountUp, Ph, Marquee, AgentNetwork });
