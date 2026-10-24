// Agentrix-IA — Page Témoignages
// Les citations viennent de agentrix/testimonials-data.js (retours réels uniquement).
function PageTestimonials({ go }) {
  const { t } = useT();
  const items = window.TESTIMONIALS || [];

  return (
    <div className="page">
      <section className="hero hero--inner">
        <div className="wrap">
          <Eyebrow>{t("testimonials.hero.eyebrow")}</Eyebrow>
          <Reveal as="h1" className="h-1 mt-m maxw-xl">{t("testimonials.hero.title")}</Reveal>
          <Reveal className="lead mt-s" delay="1">{t("testimonials.hero.sub")}</Reveal>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          {items.length === 0 ? (
            <Reveal><p className="lead maxw-xl">{t("testimonials.empty")}</p></Reveal>
          ) : (
            <div className="quotes">
              {items.map((q, i) => (
                <Reveal key={i} delay={String((i % 3) + 1)} className="quotes__cell">
                  <figure className="quote">
                    <div className="quote__mark">"</div>
                    <blockquote>{q.quote}</blockquote>
                    <figcaption className="quote__by">
                      <span>
                        <span className="quote__name">{q.name}</span>
                        <span className="quote__role">{q.role ? `${q.role} · ${q.company}` : q.company}</span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <Reveal>
            <div className="ctaband">
              <div className="ctaband__inner">
                <h2 className="h-1">{t("home.cta.title")}</h2>
                <p className="lead">{t("home.cta.sub")}</p>
                <Btn variant="primary" lg onClick={() => go("contact")} arrow>{t("home.cta.btn")}</Btn>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

window.PageTestimonials = PageTestimonials;
