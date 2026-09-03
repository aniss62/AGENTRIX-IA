// Agentrix-IA — Ambient background: subtle grid texture + 6 drifting "diodes"
// Mounted once in the app shell so it persists across route changes.
// Discreet by design: low opacity, sits behind page content (z-index 0),
// pointer-events: none so it never intercepts clicks.

function Diode({ i }) {
  const [pos, setPos] = React.useState(() => ({
    x: 8 + Math.random() * 84,
    y: 15 + Math.random() * 60,
  }));
  const [on, setOn] = React.useState(() => Math.random() > 0.4);

  React.useEffect(() => {
    let alive = true;
    const tick = () => {
      if (!alive) return;
      // turn off, then relocate + turn back on once invisible (no visible travel)
      setOn(false);
      setTimeout(() => {
        if (!alive) return;
        setPos({ x: 8 + Math.random() * 84, y: 12 + Math.random() * 66 });
        setOn(Math.random() > 0.25);
      }, 850);
      const next = 2600 + Math.random() * 3200;
      timer = setTimeout(tick, next);
    };
    let timer = setTimeout(tick, 900 + i * 620 + Math.random() * 900);
    return () => { alive = false; clearTimeout(timer); };
  }, [i]);

  return (
    <span
      className={`diode ${on ? "diode--on" : ""}`}
      style={{ left: pos.x + "%", top: pos.y + "%" }}
    ></span>
  );
}

function AmbientBackdrop() {
  const diodes = [0, 1, 2, 3, 4, 5];
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient__grid"></div>
      <div className="ambient__diodes">
        {diodes.map(i => <Diode key={i} i={i} />)}
      </div>
    </div>
  );
}

window.AmbientBackdrop = AmbientBackdrop;
