// Agentrix-IA — Custom cursor: a targeting reticle ("viseur")
function CustomCursor() {
  const ref = React.useRef(null);
  const posRef = React.useRef({ x: -100, y: -100 });
  const curRef = React.useRef({ x: -100, y: -100 });
  const rafRef = React.useRef(null);

  React.useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    const el = ref.current;
    document.documentElement.classList.add("has-reticle");

    // Probe element used to resolve --accent to a comparable computed color,
    // so we can detect "pointing at a same-colored button" regardless of
    // theme (dark vs light accent values differ).
    const probe = document.createElement("span");
    probe.style.cssText = "position:fixed;top:-999px;left:-999px;pointer-events:none;background:var(--accent);";
    document.body.appendChild(probe);
    const isAccentBg = (t) => {
      const accentColor = getComputedStyle(probe).backgroundColor;
      let node = t;
      for (let i = 0; i < 5 && node; i++) {
        if (getComputedStyle(node).backgroundColor === accentColor) return true;
        node = node.parentElement;
      }
      return false;
    };

    const onMove = (e) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
      if (el.style.opacity !== "1") el.style.opacity = "1";
    };
    const onLeave = () => { el.style.opacity = "0"; };
    const isTargetable = (t) => !!t.closest("a, button, [role='button'], input, textarea, select, .btn");
    const onOver = (e) => {
      const targetable = isTargetable(e.target);
      el.classList.toggle("reticle--active", targetable);
      el.classList.toggle("reticle--on-accent", targetable && isAccentBg(e.target));
    };
    const onDown = () => el.classList.add("reticle--down");
    const onUp = () => el.classList.remove("reticle--down");

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => {
      const p = posRef.current, c = curRef.current;
      const ease = reduce ? 1 : 0.32;
      c.x += (p.x - c.x) * ease;
      c.y += (p.y - c.y) * ease;
      el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0) translate(-50%, -50%)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("has-reticle");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(rafRef.current);
      probe.remove();
    };
  }, []);

  return (
    <div ref={ref} className="reticle" aria-hidden="true" style={{ opacity: 0 }}>
      <svg width="36" height="36" viewBox="0 0 36 36">
        <circle className="reticle__ring" cx="18" cy="18" r="13" fill="none" strokeWidth="1.3" />
        <circle className="reticle__dot" cx="18" cy="18" r="1.6" />
        <path className="reticle__ticks" d="M18 1v6M18 29v6M1 18h6M29 18h6" strokeWidth="1.3" />
      </svg>
    </div>
  );
}

window.CustomCursor = CustomCursor;
