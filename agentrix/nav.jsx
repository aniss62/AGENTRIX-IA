// Agentrix-IA — Nav + Footer
const { useState: useStateNav, useEffect } = React;

function LangSwitcher({ compact }) {
  const { lang, setLang, LANGS, LANG_ORDER } = useT();
  const [open, setOpen] = useStateNav(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={`langsw ${open ? "open" : ""}`} ref={ref}>
      <button className="langsw__btn" onClick={() => setOpen(o => !o)} aria-label="Language" aria-expanded={open}>
        <span className="langsw__cur">{LANGS[lang].label}</span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="langsw__chev"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div className="langsw__menu">
        {LANG_ORDER.map(l => (
          <button key={l} className={`langsw__opt ${l === lang ? "active" : ""}`} onClick={() => { setLang(l); setOpen(false); }}>
            <span className="langsw__lbl">{LANGS[l].label}</span>
            <span className="langsw__name">{LANGS[l].name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Nav({ route, go }) {
  const { t } = useT();
  const [scrolled, setScrolled] = useStateNav(false);
  const [menu, setMenu] = useStateNav(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenu(false); }, [route]);
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menu]);

  const links = [
    ["home", t("nav.home")],
    ["product", t("nav.product")],
    ["about", t("nav.about")],
    ["testimonials", t("nav.testimonials")]
  ];

  return (
    <header className={`nav ${scrolled ? "nav--solid" : ""}`}>
      <div className="wrap nav__inner">
        <a className="nav__brand" href="#home" onClick={(e) => { e.preventDefault(); go("home"); }}>
          <Wordmark />
        </a>

        <nav className="nav__links">
          {links.map(([key, label]) => (
            <a key={key} href={`#${key}`} className={`nav__link ${route === key ? "active" : ""}`}
               onClick={(e) => { e.preventDefault(); go(key); }}>{label}</a>
          ))}
        </nav>

        <div className="nav__right">
          <LangSwitcher />
          <span className="nav__cta-d"><Btn variant="primary" onClick={() => go("contact")} arrow>{t("nav.cta")}</Btn></span>
          <button className={`burger ${menu ? "open" : ""}`} onClick={() => setMenu(m => !m)} aria-label="Menu">
            <span></span><span></span>
          </button>
        </div>
      </div>

      <div className={`mobilemenu ${menu ? "open" : ""}`}>
        <div className="mobilemenu__links">
          {links.map(([key, label], i) => (
            <a key={key} href={`#${key}`} className={`mobilemenu__link ${route === key ? "active" : ""}`}
               style={{ transitionDelay: `${0.04 * i + 0.05}s` }}
               onClick={(e) => { e.preventDefault(); go(key); }}>
              <span className="mobilemenu__idx">0{i + 1}</span>{label}
            </a>
          ))}
        </div>
        <div className="mobilemenu__foot">
          <Btn variant="primary" lg onClick={() => go("contact")} arrow>{t("nav.cta")}</Btn>
        </div>
      </div>
    </header>
  );
}

function Footer({ go }) {
  const { t } = useT();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <Wordmark />
            <p className="lead footer__tag">{t("footer.tagline")}</p>
            <Btn variant="ghost" onClick={() => go("contact")} arrow>{t("footer.cta")}</Btn>
          </div>
          <div className="footer__cols">
            <div className="footer__col">
              <h4>{t("footer.product")}</h4>
              <a href="#product" onClick={(e) => { e.preventDefault(); go("product"); }}>{t("nav.product")}</a>
              <a href="#testimonials" onClick={(e) => { e.preventDefault(); go("testimonials"); }}>{t("nav.testimonials")}</a>
            </div>
            <div className="footer__col">
              <h4>{t("footer.company")}</h4>
              <a href="#about" onClick={(e) => { e.preventDefault(); go("about"); }}>{t("nav.about")}</a>
              <a href="#home" onClick={(e) => { e.preventDefault(); go("home"); }}>{t("nav.home")}</a>
            </div>
            <div className="footer__col">
              <h4>{t("footer.contact")}</h4>
              <a href="#contact" onClick={(e) => { e.preventDefault(); go("contact"); }}>contact@agentrix-ia.com</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); go("contact"); }}>{t("nav.cta")}</a>
            </div>
          </div>
        </div>
        <div className="rule"></div>
        <div className="footer__bottom">
          <span className="mono-tag">{t("footer.rights")}</span>
          <span className="mono-tag footer__made">FR · EN · ع</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Nav, Footer, LangSwitcher });
