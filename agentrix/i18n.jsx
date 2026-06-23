// Agentrix-IA — i18n runtime (context, hook, RTL + persistence)
const { createContext, useContext, useState, useEffect, useCallback } = React;

const LANGS = {
  fr: { label: "FR", name: "Français", dir: "ltr", dict: () => window.I18N_FR },
  en: { label: "EN", name: "English", dir: "ltr", dict: () => window.I18N_EN },
  ar: { label: "ع",  name: "العربية", dir: "rtl", dict: () => window.I18N_AR }
};
const LANG_ORDER = ["fr", "en", "ar"];

const LangContext = createContext(null);

function getInitialLang() {
  try {
    const saved = localStorage.getItem("agentrix_lang");
    if (saved && LANGS[saved]) return saved;
  } catch (e) {}
  return "fr";
}

function applyDocLang(lang) {
  const root = document.documentElement;
  root.setAttribute("lang", lang);
  root.setAttribute("dir", LANGS[lang].dir);
}

function LangProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang);

  useEffect(() => { applyDocLang(lang); }, [lang]);

  const setLang = useCallback((l) => {
    if (!LANGS[l]) return;
    setLangState(l);
    try { localStorage.setItem("agentrix_lang", l); } catch (e) {}
  }, []);

  // Deep dot-path lookup with fallback to FR
  const t = useCallback((path) => {
    const dict = LANGS[lang].dict() || window.I18N_FR;
    const get = (obj) => path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
    let v = get(dict);
    if (v === undefined) v = get(window.I18N_FR);
    return v === undefined ? path : v;
  }, [lang]);

  const value = { lang, setLang, t, dir: LANGS[lang].dir, isRTL: LANGS[lang].dir === "rtl", LANGS, LANG_ORDER };
  return React.createElement(LangContext.Provider, { value }, children);
}

function useT() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useT must be used within LangProvider");
  return ctx;
}

Object.assign(window, { LangProvider, useT, LANGS, LANG_ORDER });
