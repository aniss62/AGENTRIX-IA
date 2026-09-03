// Agentrix-IA — Page Contact (coordonnées + carte)
function PageContact() {
  const { t } = useT();
  const email = t("contact.info.email");
  const phone = t("contact.info.phone");
  const telHref = phone.replace(/[^\d+]/g, "");
  const address = t("contact.info.address");

  // Localisation : Fès, Maroc
  const lat = 34.0331, lon = -5.0003;
  const dx = 0.032, dy = 0.018;
  const bbox = [lon - dx, lat - dy, lon + dx, lat + dy].join("%2C");
  const embed = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;
  const mapLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=14/${lat}/${lon}`;

  return (
    <div className="page">
      <section className="hero hero--inner">
        <div className="wrap">
          <Eyebrow>{t("contact.hero.eyebrow")}</Eyebrow>
        </div>
      </section>

      <section className="section--tight">
        <div className="wrap">
          <div className="contact contact--info">
            <Reveal className="contact__details">
              <div className="mono-tag">{t("contact.info.eyebrow")}</div>

              <a className="detail" href={`mailto:${email}`}>
                <span className="detail__ic"><Icon name="mail" /></span>
                <span className="detail__body">
                  <span className="detail__label">{t("contact.info.emailLabel")}</span>
                  <span className="detail__val">{email}</span>
                </span>
              </a>

              <a className="detail" href={`tel:${telHref}`}>
                <span className="detail__ic"><Icon name="phone" /></span>
                <span className="detail__body">
                  <span className="detail__label">{t("contact.info.phoneLabel")}</span>
                  <span className="detail__val" dir="ltr">{phone}</span>
                </span>
              </a>

              <a className="detail" href={mapLink} target="_blank" rel="noopener noreferrer">
                <span className="detail__ic"><Icon name="pin" /></span>
                <span className="detail__body">
                  <span className="detail__label">{t("contact.info.addressLabel")}</span>
                  <span className="detail__val">
                    {address.split("\n").map((line, i) => (
                      <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>
                    ))}
                  </span>
                </span>
              </a>
            </Reveal>

            <Reveal className="contact__map" delay="1">
              <iframe
                className="contact__map-frame"
                src={embed}
                title={t("contact.info.mapLabel")}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <a className="contact__map-chip" href={mapLink} target="_blank" rel="noopener noreferrer">
                <Icon name="pin" size={15} />
                <span>{t("contact.info.mapLabel")}</span>
              </a>
            </Reveal>
          </div>

          <Reveal delay="2" className="contact__formwrap">
            <div className="mono-tag">{t("home.lead.eyebrow")}</div>
            <h2 className="h-2 mt-s">{t("home.lead.title")}</h2>
            <p className="lead mt-s">{t("home.lead.sub")}</p>
            <div className="contact__form">
              <LeadForm variant="section" />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

window.PageContact = PageContact;
