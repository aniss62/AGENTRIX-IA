// Agentrix-IA — Page Témoignages
function PageTestimonials({ go }) {
  const { t } = useT();
  const items = t("testimonials.items");

  return (
    <div className="page">
      <section className="hero hero--inner">
        <div className="wrap">
          <Eyebrow>{t("testimonials.hero.eyebrow")}</Eyebrow>
          <Reveal as="h1" className="h-1 mt-m maxw-xl">{t("testimonials.hero.title")}</Reveal>
          <Reveal className="lead mt-s" delay="1">{t("testimonials.hero.sub")}</Reveal>
        </div>
      </section>

      {/* Featured metric */}
      <section className="section--tight">
        <div className="wrap">
          <Reveal>
            <div className="tmetric">
              <div className="tmetric__val"><CountUp value="96%" /></div>
              <div className="tmetric__lbl lead">{t("testimonials.metric")}</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Masonry quotes */}
      <section className="section section--tight">
        <div className="wrap">
          <div className="quotes">
            {items.map((q, i) => (
              <Reveal key={i} delay={String((i % 3) + 1)} className="quotes__cell">
                <figure className="quote">
                  <image-slot id={`tpage-${i}`} className="quote__shot" shape="rounded" radius="14"
                    src={window.PERSON_PHOTOS[i]}
                    placeholder={t("home.tmoni.photo")} style={{ display: "block", width: "100%", height: "160px" }}></image-slot>
                  <div className="quote__mark">"</div>
                  <blockquote>{q.quote}</blockquote>
                  <figcaption className="quote__by">
                    <span>
                      <span className="quote__name">{q.name}</span>
                      <span className="quote__role">{q.role} · {q.company}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
