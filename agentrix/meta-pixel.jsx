// Agentrix-IA — Pixel Meta, chargé uniquement après consentement ("accepted")
const META_PIXEL_ID = "1465924105510827";

(function () {
  var loaded = false;

  function consented() {
    try { return localStorage.getItem("agentrix_cookie_consent") === "accepted"; } catch (e) { return false; }
  }

  function load() {
    if (loaded || typeof window === "undefined" || typeof document === "undefined") return;
    loaded = true;
    if (window.fbq) return;
    var n = window.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!window._fbq) window._fbq = n;
    n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(s);
    window.fbq("init", META_PIXEL_ID);
  }

  window.MetaPixel = {
    // Appelé à chaque page vue (changement de route) et au clic sur « Accepter »
    pageView: function () {
      if (!consented()) return;
      load();
      if (window.fbq) window.fbq("track", "PageView");
    },
    track: function (name, params) {
      if (!consented()) return;
      load();
      if (window.fbq) window.fbq("track", name, params || {});
    }
  };
})();
