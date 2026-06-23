// Agentrix-IA — Interactive chat agent: reusable ChatBox + floating widget + inline section
const { useState: useStateChat, useRef: useRefChat, useEffect: useEffectChat } = React;

/* ---------- Core conversation UI (reused by widget + inline section) ---------- */
function ChatBox({ variant = "panel", autostart = false, onClose }) {
  const { t } = useT();
  const items = t("home.chat.items");
  const [msgs, setMsgs] = useStateChat([]);
  const [typing, setTyping] = useStateChat(false);
  const [asked, setAsked] = useStateChat([]);
  const [leadShown, setLeadShown] = useStateChat(false);
  const [input, setInput] = useStateChat("");
  const [started, setStarted] = useStateChat(false);
  const scrollRef = useRefChat(null);
  const timers = useRefChat([]);

  useEffectChat(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing, leadShown]);

  const welcome = () => {
    setTyping(true);
    const tm = setTimeout(() => { setTyping(false); setMsgs([{ role: "bot", text: t("home.chat.welcome") }]); setStarted(true); }, 600);
    timers.current.push(tm);
  };

  useEffectChat(() => { if (autostart) welcome(); }, []);
  useEffectChat(() => () => timers.current.forEach(clearTimeout), []);

  const pushBot = (text, extra) => {
    setTyping(true);
    const tm = setTimeout(() => {
      setTyping(false);
      setMsgs(m => [...m, { role: "bot", text }]);
      if (extra) extra();
    }, Math.min(1400, 500 + text.length * 9));
    timers.current.push(tm);
  };

  const askIndex = (i) => {
    setMsgs(m => [...m, { role: "user", text: items[i].q }]);
    setAsked(a => a.includes(i) ? a : [...a, i]);
    pushBot(items[i].a);
  };

  const askLead = () => {
    setMsgs(m => [...m, { role: "user", text: t("home.chat.leadQ") }]);
    pushBot(t("home.chat.leadIntro"), () => { setLeadShown(true); setMsgs(m => [...m, { type: "lead" }]); });
  };

  const matchAnswer = (text) => {
    const toks = text.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(w => w.length >= 4);
    let best = -1, score = 0;
    items.forEach((it, idx) => {
      const q = it.q.toLowerCase();
      let s = 0; toks.forEach(w => { if (q.includes(w)) s++; });
      if (s > score) { score = s; best = idx; }
    });
    return score > 0 ? best : -1;
  };

  const sendFree = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || typing) return;
    setInput("");
    setMsgs(m => [...m, { role: "user", text }]);
    const i = matchAnswer(text);
    if (i >= 0) { setAsked(a => a.includes(i) ? a : [...a, i]); pushBot(items[i].a); }
    else pushBot(t("home.chat.fallback"), () => { if (!leadShown) { setLeadShown(true); setMsgs(m => [...m, { type: "lead" }]); } });
  };

  const restart = () => {
    timers.current.forEach(clearTimeout); timers.current = [];
    setMsgs([]); setAsked([]); setLeadShown(false); setInput("");
    welcome();
  };

  const remaining = items.map((_, i) => i).filter(i => !asked.includes(i));
  const showSuggestions = !typing && !leadShown && msgs.length > 0;

  return (
    <div className={`chatbox chatbox--${variant}`}>
      <header className="chat__head">
        <div className="chat__head-id">
          <span className="chat__avatar"><Logo size={22} /><span className="chat__online"></span></span>
          <span className="chat__head-txt">
            <span className="chat__head-title">{t("home.chat.title")}</span>
            <span className="chat__head-status">{t("home.chat.status")}</span>
          </span>
        </div>
        <div className="chat__head-actions">
          <button className="chat__icbtn" onClick={restart} aria-label={t("home.chat.restart")} title={t("home.chat.restart")}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>
          </button>
          {onClose && <button className="chat__icbtn" onClick={onClose} aria-label="Close"><Icon name="close" size={17} /></button>}
        </div>
      </header>

      <div className="chat__body" ref={scrollRef}>
        {msgs.map((m, i) => {
          if (m.type === "lead") return <div key={i} className="chat__lead"><LeadForm variant="chat" /></div>;
          return (
            <div key={i} className={`chat__msg chat__msg--${m.role}`}>
              {m.role === "bot" && <span className="chat__msg-av"><Logo size={15} /></span>}
              <div className="chat__bubble">{m.text}</div>
            </div>
          );
        })}
        {typing && (
          <div className="chat__msg chat__msg--bot">
            <span className="chat__msg-av"><Logo size={15} /></span>
            <div className="chat__bubble chat__bubble--typing"><span></span><span></span><span></span></div>
          </div>
        )}
        {showSuggestions && (
          <div className="chat__suggs">
            {msgs.length <= 1 && <div className="chat__suggs-lbl mono-tag">{t("home.chat.intro")}</div>}
            {remaining.map(i => (
              <button key={i} className="chat__sugg" onClick={() => askIndex(i)}>{items[i].q}</button>
            ))}
            <button className="chat__sugg chat__sugg--cta" onClick={askLead}>{t("home.chat.leadQ")}</button>
          </div>
        )}
      </div>

      <form className="chat__input" onSubmit={sendFree}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder={t("home.chat.inputPlaceholder")} />
        <button type="submit" className="chat__send" aria-label="Send" disabled={!input.trim() || typing}><Icon name="send" size={18} /></button>
      </form>
    </div>
  );
}

/* ---------- Floating widget ---------- */
function ChatAgent() {
  const { t } = useT();
  const [open, setOpen] = useStateChat(false);
  return (
    <div className={`chat ${open ? "chat--open" : ""}`}>
      <button className="chat__launcher" onClick={() => setOpen(true)} aria-label={t("home.chat.launcher")}>
        <span className="chat__launcher-ic"><Icon name="chat" size={22} /></span>
        <span className="chat__launcher-txt">{t("home.chat.launcher")}</span>
        <span className="chat__launcher-dot"></span>
      </button>
      <div className="chat__panel" role="dialog" aria-label={t("home.chat.title")}>
        {open && <ChatBox variant="panel" autostart onClose={() => setOpen(false)} />}
      </div>
    </div>
  );
}

/* ---------- Inline framed section (on the page) ---------- */
function ChatSection() {
  const { t } = useT();
  return (
    <section className="section section--tight">
      <div className="wrap">
        <div className="chatsec">
          <Reveal className="chatsec__copy">
            <Eyebrow>{t("home.chat.secEyebrow")}</Eyebrow>
            <h2 className="h-1 mt-s">{t("home.chat.secTitle")}</h2>
            <p className="lead mt-s">{t("home.chat.secSub")}</p>
            <ul className="chatsec__hints">
              {t("home.chat.items").slice(0, 4).map((it, i) => (
                <li key={i}><span className="chatsec__hint-ic"><Icon name="chat" size={15} /></span>{it.q}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="chatsec__frame" delay="1">
            <ChatBox variant="inline" autostart />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ChatBox, ChatAgent, ChatSection });
