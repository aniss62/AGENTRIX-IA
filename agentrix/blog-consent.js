// Agentrix-IA — Bannière cookies + Pixel Meta pour les pages du blog (HTML statiques).
// Même clé de consentement et mêmes textes que le site (cookie-consent.jsx / meta-pixel.jsx).
(function () {
  var KEY = "agentrix_cookie_consent";
  var PIXEL_ID = "1465924105510827";
  var T = {
    fr: { title: "Cookies : essentiels, et publicité si vous acceptez", text: "Les cookies essentiels mémorisent votre langue. Avec « Accepter », nous activons aussi le pixel Meta pour mesurer nos publicités. « Refuser » ne charge aucun traceur.", link: "En savoir plus", accept: "Accepter", decline: "Refuser" },
    en: { title: "Cookies: essential, plus ads if you accept", text: "Essential cookies remember your language. With “Accept”, we also enable the Meta pixel to measure our ads. “Decline” loads no tracker.", link: "Learn more", accept: "Accept", decline: "Decline" },
    ar: { title: "ملفات تعريف الارتباط: أساسية، وإعلانية إذا قبلت", text: "الملفات الأساسية تحفظ لغتك. عند «قبول» نفعّل أيضًا بكسل Meta لقياس إعلاناتنا. «رفض» لا يحمّل أي متتبع.", link: "معرفة المزيد", accept: "قبول", decline: "رفض" }
  };
  var SVG_NS = "http://www.w3.org/2000/svg";

  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  function pageView() {
    if (get(KEY) !== "accepted") return;
    if (!window.fbq) {
      var n = window.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!window._fbq) window._fbq = n;
      n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(s);
      window.fbq("init", PIXEL_ID);
    }
    window.fbq("track", "PageView");
  }

  function h(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function cookieIcon() {
    var svg = document.createElementNS(SVG_NS, "svg");
    var attrs = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 1.6, "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" };
    for (var k in attrs) svg.setAttribute(k, attrs[k]);
    var path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", "M20.5 12.3a2.6 2.6 0 01-2.9-2.9 2.6 2.6 0 01-2.9-2.9A8.5 8.5 0 1020.5 12.3z");
    svg.appendChild(path);
    [[9, 10], [8.3, 14.7], [13, 16], [14.5, 12]].forEach(function (c) {
      var d = document.createElementNS(SVG_NS, "circle");
      d.setAttribute("cx", c[0]); d.setAttribute("cy", c[1]); d.setAttribute("r", 1);
      d.setAttribute("fill", "currentColor"); d.setAttribute("stroke", "none");
      svg.appendChild(d);
    });
    return svg;
  }

  function banner() {
    var lang = get("agentrix_lang");
    var t = T[lang] || T.fr;
    var el = h("div", "cookiebanner");
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-live", "polite");
    el.setAttribute("aria-label", t.title);
    if (lang === "ar") el.setAttribute("dir", "rtl");

    var ic = h("span", "cookiebanner__ic");
    ic.appendChild(cookieIcon());

    var body = h("div", "cookiebanner__body");
    body.appendChild(h("p", "cookiebanner__title", t.title));
    var p = h("p", "cookiebanner__text", t.text + " ");
    var a = h("a", null, t.link);
    a.href = "/cookies/";
    p.appendChild(a);
    body.appendChild(p);

    var actions = h("div", "cookiebanner__actions");
    function btn(cls, label, value) {
      var b = h("button", "btn " + cls, label);
      b.type = "button";
      b.addEventListener("click", function () {
        try { localStorage.setItem(KEY, value); } catch (e) {}
        el.remove();
        pageView();
      });
      return b;
    }
    actions.appendChild(btn("btn--ghost", t.decline, "declined"));
    actions.appendChild(btn("btn--primary", t.accept, "accepted"));

    el.appendChild(ic);
    el.appendChild(body);
    el.appendChild(actions);
    document.body.appendChild(el);
  }

  function start() {
    if (get(KEY)) pageView(); else banner();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
