// Agentrix-IA — Pages légales (Confidentialité / Cookies / Conditions)
function LegalPage({ type }) {
  const { t } = useT();
  const base = `legal.${type}`;
  const sections = t(`${base}.sections`);

  return (
    <div className="page">
      <section className="hero hero--inner">
        <div className="wrap">
          <Eyebrow>{t(`${base}.eyebrow`)}</Eyebrow>
          <Reveal as="h1" className="h-1 mt-m maxw-xl">{t(`${base}.title`)}</Reveal>
          <p className="mono-tag mt-s">{t(`${base}.updated`)}</p>
          <Reveal className="lead mt-s maxw-xl" delay="1">{t(`${base}.intro`)}</Reveal>
        </div>
      </section>

      <section className="section--tight">
        <div className="wrap">
          <div className="legal">
            {sections.map((s, i) => (
              <Reveal key={i} delay={String((i % 3) + 1)} className="legal__item">
                <h3 className="h-3">{s.h}</h3>
                <p>{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function PagePrivacy() { return <LegalPage type="privacy" />; }
function PageCookies() { return <LegalPage type="cookies" />; }
function PageTerms() { return <LegalPage type="terms" />; }

Object.assign(window, { PagePrivacy, PageCookies, PageTerms });
