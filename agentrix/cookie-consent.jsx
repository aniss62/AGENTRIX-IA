// Agentrix-IA — Cookie consent banner
const COOKIE_CONSENT_KEY = "agentrix_cookie_consent";

function CookieConsent({ go }) {
  const { t } = useT();
  const [choice, setChoice] = React.useState(() => {
    try { return localStorage.getItem(COOKIE_CONSENT_KEY); } catch (e) { return null; }
  });

  const decide = (value) => {
    setChoice(value);
    try { localStorage.setItem(COOKIE_CONSENT_KEY, value); } catch (e) {}
  };

  if (choice) return null;

  return (
    <div className="cookiebanner" role="dialog" aria-live="polite" aria-label={t("cookieBanner.title")}>
      <span className="cookiebanner__ic"><Icon name="cookie" size={26} /></span>
      <div className="cookiebanner__body">
        <p className="cookiebanner__title">{t("cookieBanner.title")}</p>
        <p className="cookiebanner__text">
          {t("cookieBanner.text")}{" "}
          <a href="#cookies" onClick={(e) => { e.preventDefault(); go("cookies"); }}>{t("cookieBanner.link")}</a>
        </p>
      </div>
      <div className="cookiebanner__actions">
        <button className="btn btn--ghost" onClick={() => decide("declined")}>{t("cookieBanner.decline")}</button>
        <button className="btn btn--primary" onClick={() => decide("accepted")}>{t("cookieBanner.accept")}</button>
      </div>
    </div>
  );
}

window.CookieConsent = CookieConsent;
