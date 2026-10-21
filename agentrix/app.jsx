// Agentrix-IA — App shell + router
const { useState: useStateApp, useEffect } = React;

// Chaque page a sa propre adresse (indexable séparément par Google).
// Les anciennes adresses en # (/#product…) sont redirigées vers les nouvelles.
const ROUTE_PATHS = {
  home: "/",
  product: "/produit/",
  about: "/a-propos/",
  contact: "/contact/",
  privacy: "/confidentialite/",
  cookies: "/cookies/",
  terms: "/conditions/"
};
const ROUTES = Object.keys(ROUTE_PATHS);

function routeHref(r) { return ROUTE_PATHS[r] || "/"; }

function getRouteFromLocation() {
  const legacy = (location.hash || "").replace("#", "");
  if (ROUTE_PATHS[legacy]) return legacy;
  const path = location.pathname.replace(/\/index\.html$/, "/").replace(/\/?$/, "/");
  return ROUTES.find((r) => ROUTE_PATHS[r] === path) || "home";
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
  const [route, setRoute] = useStateApp(getRouteFromLocation);

  useEffect(() => {
    // Ancienne adresse en # (/#product) → nouvelle adresse (/produit/)
    const legacy = (location.hash || "").replace("#", "");
    if (ROUTE_PATHS[legacy]) history.replaceState(null, "", routeHref(legacy));
    else if (legacy === "testimonials") history.replaceState(null, "", "/");
    const onPop = () => setRoute(getRouteFromLocation());
    window.addEventListener("popstate", onPop);
    window.addEventListener("hashchange", onPop);
    return () => { window.removeEventListener("popstate", onPop); window.removeEventListener("hashchange", onPop); };
  }, []);

  const go = (r) => {
    if (!ROUTE_PATHS[r]) r = "home";
    if (location.pathname !== routeHref(r) || location.hash) history.pushState(null, "", routeHref(r));
    setRoute(r);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  };

  // Titre de l'onglet et adresse canonique propres à chaque page
  useEffect(() => {
    const titles = window.PAGE_TITLES || {};
    if (titles[route]) document.title = titles[route];
    const canon = document.querySelector('link[rel="canonical"]');
    const site = canon ? new URL(canon.getAttribute("href"), location.href).origin : location.origin;
    const url = site + routeHref(route);
    if (canon) canon.setAttribute("href", url);
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", url);
  }, [route]);

  // scroll to top on route change
  useEffect(() => { window.scrollTo(0, 0); }, [route]);

  const pages = {
    home: window.PageHome,
    product: window.PageProduct,
    about: window.PageAbout,
    contact: window.PageContact,
    privacy: window.PagePrivacy,
    cookies: window.PageCookies,
    terms: window.PageTerms
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
      <CookieConsent go={go} />
      <CustomCursor />
    </>
  );
}

function Root() {
  return (
    <ThemeProvider>
      <LangProvider>
        <App />
      </LangProvider>
    </ThemeProvider>
  );
}

Object.assign(window, { ROUTE_PATHS, routeHref });

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
