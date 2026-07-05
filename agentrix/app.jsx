// Agentrix-IA — App shell + router
const { useState: useStateApp, useEffect } = React;

const ROUTES = ["home", "product", "about", "testimonials", "contact"];

function getRouteFromHash() {
  const h = (location.hash || "").replace("#", "");
  return ROUTES.includes(h) ? h : "home";
}

function PageStub({ route }) {
  const { t } = useT();
  return (
    <div className="page">
      <section className="hero">
        <div className="wrap">
          <Eyebrow>{t("nav." + route)}</Eyebrow>
          <h1 className="h-1 mt-m">En construction</h1>
          <p className="lead mt-s">Cette page arrive juste après.</p>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [route, setRoute] = useStateApp(getRouteFromHash);

  useEffect(() => {
    const onHash = () => setRoute(getRouteFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (r) => {
    if (location.hash !== "#" + r) location.hash = "#" + r;
    else setRoute(r);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  };

  // scroll to top on route change
  useEffect(() => { window.scrollTo(0, 0); }, [route]);

  const pages = {
    home: window.PageHome,
    product: window.PageProduct,
    about: window.PageAbout,
    testimonials: window.PageTestimonials,
    contact: window.PageContact
  };
  const Page = pages[route] || null;

  return (
    <>
      <AmbientBackdrop />
      <Nav route={route} go={go} />
      <main key={route}>
        {Page ? <Page go={go} /> : <PageStub route={route} />}
      </main>
      <Footer go={go} />
      <AgentrixTweaks />
      <ChatAgent />
    </>
  );
}

function Root() {
  return (
    <LangProvider>
      <App />
    </LangProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
