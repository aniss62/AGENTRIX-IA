// Agentrix-IA — Lead form (reusable) + Home testimonials + Home FAQ
const { useState: useStateHS } = React;

/* ---------- Reusable lead-capture form ---------- */
function LeadForm({ variant = "section", onDone }) {
  const { t } = useT();
  const [v, setV] = useStateHS({ name: "", first: "", email: "", project: "" });
  const [err, setErr] = useStateHS({});
  const [status, setStatus] = useStateHS("idle"); // idle | sending | sent

  const set = (k) => (e) => { setV(s => ({ ...s, [k]: e.target.value })); setErr(er => ({ ...er, [k]: undefined })); };

  const validate = () => {
    const er = {};
    if (!v.name.trim()) er.name = t("home.lead.required");
    if (!v.email.trim()) er.email = t("home.lead.required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) er.email = t("home.lead.emailInvalid");
    if (!v.project.trim()) er.project = t("home.lead.required");
    setErr(er);
    return Object.keys(er).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    const nom = [v.name.trim(), v.first.trim()].filter(Boolean).join(" ");
    fetch("/api/submit-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, email: v.email.trim(), message: v.project.trim() })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.ok) { setStatus("sent"); if (onDone) onDone(v); }
        else { setStatus("error"); }
      })
      .catch(function () { setStatus("error"); });
  };

  const reset = () => { setV({ name: "", first: "", email: "", project: "" }); setErr({}); setStatus("idle"); };

  if (status === "sent") {
    return (
      <div className={`leadf__success ${variant === "chat" ? "leadf__success--chat" : ""}`}>
        <div className="leadf__success-ic"><Icon name="check" size={variant === "chat" ? 20 : 26} /></div>
        <div className="leadf__success-txt">
          <strong>{t("home.lead.success")}</strong>
          <span className="muted">{t("home.lead.successSub")}</span>
        </div>
        {variant === "section" && <Btn variant="ghost" onClick={reset}>{t("home.lead.again")}</Btn>}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={`leadf__success ${variant === "chat" ? "leadf__success--chat" : ""}`}>
        <div className="leadf__success-ic" style={{ color: "#e55" }}><Icon name="close" size={variant === "chat" ? 20 : 26} /></div>
        <div className="leadf__success-txt">
          <strong>{t("home.lead.errorTitle")}</strong>
          <span className="muted">{t("home.lead.errorRetry")}</span>
        </div>
        <Btn variant="ghost" onClick={reset}>{t("home.lead.again")}</Btn>
      </div>
    );
  }

  const Lbl = ({ k, opt, req }) => (
    <span className="leadf__lbl">{t("home.lead." + k)}{req && <em className="leadf__req" aria-hidden="true">*</em>}{opt && <em className="leadf__opt"> {t("home.lead.optional")}</em>}</span>
  );

  return (
    <form className={`leadf leadf--${variant}`} onSubmit={submit} noValidate>
      <div className="leadf__row">
        <label className="leadf__field">
          <Lbl k="fName" req />
          <input type="text" value={v.name} onChange={set("name")} className={err.name ? "err" : ""} />
          {err.name && <span className="leadf__err">{err.name}</span>}
        </label>
        <label className="leadf__field">
          <Lbl k="fFirst" opt />
          <input type="text" value={v.first} onChange={set("first")} />
        </label>
      </div>
      <label className="leadf__field">
        <Lbl k="fEmail" req />
        <input type="email" value={v.email} onChange={set("email")} className={err.email ? "err" : ""} />
        {err.email && <span className="leadf__err">{err.email}</span>}
      </label>
      <label className="leadf__field">
        <Lbl k="fProject" req />
        <textarea rows={variant === "chat" ? "2" : "3"} value={v.project} onChange={set("project")}
          placeholder={t("home.lead.fProjectPh")} className={err.project ? "err" : ""}></textarea>
        {err.project && <span className="leadf__err">{err.project}</span>}
      </label>
      <Btn variant="primary" lg={variant === "section"} arrow>
        {status === "sending" ? t("home.lead.sending") : t("home.lead.submit")}
      </Btn>
    </form>
  );
}

/* ---------- Home: lead section ---------- */
function LeadSection() {
  const { t } = useT();
  return (
    <section className="section section--tight" id="lead">
      <div className="wrap">
        <Reveal>
          <div className="leadband">
            <div className="leadband__copy">
              <Eyebrow>{t("home.lead.eyebrow")}</Eyebrow>
              <h2 className="h-1 mt-s">{t("home.lead.title")}</h2>
              <p className="lead mt-s">{t("home.lead.sub")}</p>
            </div>
            <div className="leadband__form">
              <LeadForm variant="section" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Home: testimonials with photos ---------- */
function HomeTestimonials({ go }) {
  const { t } = useT();
  const all = t("testimonials.items");
  const featured = all.slice(0, 3);
  return (
    <section className="section section--tight">
      <div className="wrap">
        <div className="shead">
          <Eyebrow>{t("home.tmoni.eyebrow")}</Eyebrow>
          <h2 className="h-1">{t("home.tmoni.title")}</h2>
          <p className="lead">{t("home.tmoni.sub")}</p>
        </div>
        <div className="grid cols-3">
          {featured.map((q, i) => (
            <Reveal key={i} delay={String(i + 1)}>
              <figure className="ftm">
                <image-slot id={`tmoni-${i}`} className="ftm__shot" shape="rounded" radius="16"
                  src={window.PERSON_PHOTOS[i]}
                  placeholder={t("home.tmoni.photo")} style={{ display: "block", width: "100%", height: "210px" }}></image-slot>
                <blockquote className="ftm__quote">{q.quote}</blockquote>
                <figcaption className="ftm__by">
                  <span className="ftm__name">{q.name}</span>
                  <span className="ftm__role">{q.role}</span>
                  <span className="ftm__co">{q.company}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <Reveal className="ftm__more" delay="2">
          <Btn variant="ghost" onClick={() => go("testimonials")} arrow>{t("nav.testimonials")}</Btn>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Home: FAQ accordion ---------- */
function HomeFAQ() {
  const { t } = useT();
  const items = t("home.faq.items");
  const [open, setOpen] = useStateHS(0);
  return (
    <section className="section">
      <div className="wrap">
        <div className="faq-grid">
          <div className="shead" style={{ marginBottom: 0 }}>
            <Eyebrow>{t("home.faq.eyebrow")}</Eyebrow>
            <h2 className="h-2 mt-s">{t("home.faq.title")}</h2>
            <p className="lead mt-s">{t("home.faq.sub")}</p>
          </div>
          <div className="faq-list">
            {items.map((f, i) => (
              <div key={i} className={`faq-item ${open === i ? "open" : ""}`}>
                <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                  <span>{f.q}</span>
                  <span className="faq-ic"><Icon name="plus" size={18} /></span>
                </button>
                <div className="faq-a"><p>{f.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { LeadForm, LeadSection, HomeTestimonials, HomeFAQ });
