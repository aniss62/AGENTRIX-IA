// Agentrix — build de production (exécuté par Vercel : `npm run build`)
//
// 1. Copie le site dans dist/
// 2. Compile tous les <script type="text/babel"> de index.html en un seul
//    bundle (esbuild) → plus de Babel ni de compilation dans le navigateur
// 3. Sert React en version production depuis le site (plus de unpkg)
// 4. Pré-rend chaque page (/, /produit/, /a-propos/, /contact/, pages légales)
//    en HTML statique → les robots (Google, GPTBot, ClaudeBot…) lisent le
//    contenu sans JS, et chaque page a sa propre adresse indexable
// 5. Complète llms.txt (articles du blog) et sitemap.xml (pages du site)
//
// Les sources (index.html + agentrix/*.jsx) restent inchangées : on continue
// à les modifier comme avant, le build s'occupe du reste.

import { readFileSync, writeFileSync, rmSync, mkdirSync, cpSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { transform } from "esbuild";
import { JSDOM } from "jsdom";

const require = createRequire(import.meta.url);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const SITE_URL = "https://www.agentrix-ia.com/";
const EXCLUDE = new Set(["node_modules", ".git", "dist", ".vercel", "scripts", ".env", ".env.local", "package.json", "package-lock.json"]);

const log = (...a) => console.log("[build]", ...a);
const hash = (s) => createHash("sha1").update(s).digest("hex").slice(0, 10);

// ── 1. Copie ────────────────────────────────────────────────────────────────
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST);
for (const entry of readdirSync(ROOT)) {
  if (EXCLUDE.has(entry)) continue;
  cpSync(join(ROOT, entry), join(DIST, entry), { recursive: true });
}

let html = readFileSync(join(ROOT, "index.html"), "utf8");

// ── 2. Bundle JSX ───────────────────────────────────────────────────────────
const babelTags = [...html.matchAll(/<script\s+type="text\/babel"\s+src="([^"]+)"\s*><\/script>\s*/g)];
if (!babelTags.length) throw new Error("Aucun script text/babel trouvé dans index.html");

// Même sémantique que Babel standalone : chaque fichier est un script classique
// qui partage la portée globale, exécuté dans l'ordre de index.html.
let source = "";
for (const [, src] of babelTags) {
  // Babel standalone transforme const/let en var : plusieurs fichiers
  // redéclarent par ex. `const { useEffect } = React` au niveau global.
  const code = readFileSync(join(ROOT, src), "utf8").replace(/^(?:const|let)(?=\s)/gm, "var");
  const out = await transform(code, { loader: "jsx", jsx: "transform", sourcefile: src, target: "es2019" });
  source += `\n/* ${src} */\n${out.code}`;
}
const bundle = (await transform(source, { minify: true, target: "es2019" })).code;
const bundleName = `agentrix/app.${hash(bundle)}.js`;
writeFileSync(join(DIST, bundleName), bundle);
log(`${babelTags.length} fichiers JSX → ${bundleName} (${(bundle.length / 1024).toFixed(0)} Ko)`);

// Remplace les balises Babel par le bundle (à la place de la première)
let first = true;
html = html.replace(/<script\s+type="text\/babel"\s+src="[^"]+"\s*><\/script>\s*/g, () => {
  if (!first) return "";
  first = false;
  return `<script src="${bundleName}"></script>\n`;
});

// ── 3. React production auto-hébergé, sans Babel ────────────────────────────
mkdirSync(join(DIST, "agentrix/vendor"), { recursive: true });
const vendor = [
  ["react", "react/umd/react.production.min.js"],
  ["react-dom", "react-dom/umd/react-dom.production.min.js"]
];
for (const [name, file] of vendor) {
  const code = readFileSync(join(ROOT, "node_modules", file), "utf8");
  const out = `agentrix/vendor/${name}.${hash(code)}.min.js`;
  writeFileSync(join(DIST, out), code);
  const re = new RegExp(`<script src="https://unpkg\\.com/${name}@[^"]+"[^>]*></script>`);
  if (!re.test(html)) throw new Error(`Balise unpkg introuvable pour ${name}`);
  html = html.replace(re, `<script src="${out}"></script>`);
}
html = html.replace(/\s*<script src="https:\/\/unpkg\.com\/@babel\/standalone@[^"]+"[^>]*><\/script>/, "");

// ── 4. Pré-rendu : une vraie page HTML par adresse ──────────────────────────
// Chaque route du site (voir ROUTE_PATHS dans agentrix/app.jsx) devient un
// fichier dist/<chemin>/index.html avec son propre titre, sa description,
// sa canonical et son contenu déjà rendu → indexable séparément par Google.
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const SITE = SITE_URL.replace(/\/$/, "");

const PAGES = [
  { route: "home", path: "/", title: null, description: null, sitemap: { priority: "1.0", changefreq: "weekly" } },
  { route: "product", path: "/produit/", title: "Plateforme d'agents IA autonomes · Agentrix·IA",
    description: "Des agents IA qui observent, planifient et agissent dans vos outils : CRM, e-mail, bases de données. Découvrez la plateforme Agentrix.",
    sitemap: { priority: "0.9", changefreq: "monthly" } },
  { route: "about", path: "/a-propos/", title: "À propos · Agentrix·IA, agence d'IA agentique",
    description: "Agentrix rend l'automatisation autonome accessible à toutes les équipes. Notre mission, nos valeurs et l'équipe derrière nos agents IA.",
    sitemap: { priority: "0.7", changefreq: "monthly" } },
  { route: "contact", path: "/contact/", title: "Contact · Parlons de votre projet d'IA · Agentrix·IA",
    description: "Une question, un projet d'agent IA ? Écrivez-nous, appelez-nous ou demandez un diagnostic gratuit de 30 minutes.",
    sitemap: { priority: "0.8", changefreq: "yearly" } },
  { route: "testimonials", path: "/temoignages/", title: "Témoignages clients · Agentrix·IA",
    description: "Les retours des équipes qui ont déployé des agents Agentrix.",
    sitemap: { priority: "0.6", changefreq: "monthly" } },
  { route: "privacy", path: "/confidentialite/", title: "Politique de confidentialité · Agentrix·IA",
    description: "Quelles données Agentrix collecte, pourquoi, et comment exercer vos droits.", sitemap: null },
  { route: "cookies", path: "/cookies/", title: "Politique de cookies · Agentrix·IA",
    description: "Les cookies utilisés sur agentrix-ia.com et comment gérer vos préférences.", sitemap: null },
  { route: "terms", path: "/conditions/", title: "Conditions d'utilisation · Agentrix·IA",
    description: "Les conditions qui régissent l'utilisation du site agentrix-ia.com.", sitemap: null }
];

const classicScripts = [...html.matchAll(/<script src="(agentrix\/(?!vendor\/|app\.)[^"]+)"><\/script>/g)]
  .map(([, src]) => readFileSync(join(ROOT, src), "utf8"));

function renderRoute(path) {
  const dom = new JSDOM(`<!DOCTYPE html><html lang="fr"><head></head><body><div id="root"></div></body></html>`, {
    url: SITE + path, runScripts: "outside-only", pretendToBeVisual: true
  });
  const w = dom.window;
  w.matchMedia = w.matchMedia || ((q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));
  w.scrollTo = () => {};
  w.React = React;
  let rootElement = null;
  w.ReactDOM = { createRoot: () => ({ render: (el) => { rootElement = el; } }) };
  for (const code of classicScripts) w.eval(code);
  w.eval(bundle);
  if (!rootElement) throw new Error("Le bundle n'a pas appelé createRoot().render()");
  if (!w.ROUTE_PATHS) throw new Error("ROUTE_PATHS introuvable dans le bundle");
  const out = ReactDOMServer.renderToString(rootElement);
  dom.window.close();
  return { markup: out, routePaths: w.ROUTE_PATHS };
}

const esc = (v) => v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
if (!html.includes('<div id="root"></div>')) throw new Error('<div id="root"></div> introuvable');
html = html.replace(/<html lang="fr"([^>]*)>/, (m, attrs) => attrs.includes("data-theme") ? m : `<html lang="fr"${attrs} data-theme="dark">`);

// Titres d'onglet par page, utilisés par le routeur côté navigateur
const titles = Object.fromEntries(PAGES.map((p) => [p.route, p.title || (html.match(/<title>([^<]*)<\/title>/) || [])[1]]));
html = html.replace("</head>", `  <script>window.PAGE_TITLES = ${JSON.stringify(titles).replace(/</g, "\\u003c")};</script>\n</head>`);

const sitemapUrls = [];
for (const page of PAGES) {
  const { markup, routePaths } = renderRoute(page.path);
  if (routePaths[page.route] !== page.path) throw new Error(`Chemin incohérent pour ${page.route} : ${routePaths[page.route]} (app.jsx) ≠ ${page.path} (build)`);
  const text = new JSDOM(markup).window.document.body.textContent.replace(/\s+/g, " ").trim();
  const minText = page.route === "home" ? 1000 : 150;
  if (text.length < minText) throw new Error(`Pré-rendu trop court pour ${page.path} (${text.length} caractères)`);
  if (!/<h1[\s>]/.test(markup)) throw new Error(`Pré-rendu sans <h1> pour ${page.path}`);

  let out = html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
  if (page.route !== "home") {
    const url = SITE + page.path;
    const swaps = [
      [/<title>[^<]*<\/title>/, `<title>${esc(page.title)}</title>`],
      [/(<meta name="description" content=")[^"]*(")/, `$1${esc(page.description)}$2`],
      [/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`],
      [/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`],
      [/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(page.title)}$2`],
      [/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(page.description)}$2`],
      [/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(page.title)}$2`],
      [/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(page.description)}$2`]
    ];
    for (const [re, rep] of swaps) {
      if (!re.test(out)) throw new Error(`Balise introuvable dans index.html : ${re}`);
      out = out.replace(re, rep);
    }
    // Pages non encore publiques (ex. témoignages sans citation réelle) : hors index Google
    if (page.noindex) out = out.replace(/(<meta name="robots" content=")[^"]*(")/, "$1noindex, nofollow$2");
    // Les données structurées Organization/WebSite restent sur l'accueil seulement
    out = out.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/, "");
  }
  // Chemins relatifs (agentrix/…) → absolus : les pages sont dans des sous-dossiers
  // et le routeur change d'adresse sans recharger la page
  out = out.replace(/(href|src)="(agentrix\/[^"]+)"/g, '$1="/$2"');
  mkdirSync(join(DIST, page.path), { recursive: true });
  writeFileSync(join(DIST, page.path, "index.html"), out);
  if (page.sitemap) sitemapUrls.push({ loc: SITE + page.path, ...page.sitemap });
  log(`${page.path.padEnd(18)} pré-rendu : ${(markup.length / 1024).toFixed(0)} Ko, ${text.length} caractères`);
}

// Sitemap : pages du site ajoutées à celles déjà listées (blog…)
{
  let sm = readFileSync(join(ROOT, "sitemap.xml"), "utf8");
  const add = sitemapUrls
    .filter((u) => !sm.includes(`<loc>${u.loc}</loc>`))
    .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>\n`)
    .join("");
  sm = sm.replace(/(<urlset[^>]*>\n)/, `$1${add}`);
  writeFileSync(join(DIST, "sitemap.xml"), sm);
  log(`sitemap.xml : ${sitemapUrls.length} pages du site`);
}

// ── 5. llms.txt : section Blog générée depuis blog/*/index.html ──────────────
// Évite toute édition manuelle de llms.txt à chaque nouvel article.
{
  const attr = (src, re) => (src.match(re) || [])[1];
  const entries = [];
  for (const slug of readdirSync(join(ROOT, "blog"), { withFileTypes: true })) {
    if (!slug.isDirectory()) continue;
    const page = readFileSync(join(ROOT, "blog", slug.name, "index.html"), "utf8");
    const title = attr(page, /property="og:title" content="([^"]*)"/);
    const desc = attr(page, /name="description" content="([^"]*)"/);
    if (title && desc) entries.push(`- [${title}](https://www.agentrix-ia.com/blog/${slug.name}/): ${desc}`);
  }
  const section = [
    "## Blog",
    "",
    "- [Blog](https://www.agentrix-ia.com/blog/): Articles (in French) on workflow automation, lead scraping, conversion-focused websites and reasoning agents.",
    ...entries.sort(),
    "",
    "",
  ].join("\n");
  const llms = readFileSync(join(ROOT, "llms.txt"), "utf8");
  writeFileSync(join(DIST, "llms.txt"), llms.replace("## Contact", section + "## Contact"));
  log(`llms.txt : ${entries.length} articles de blog ajoutés`);
}

// ── 6. Blog : thème clair/sombre partagé avec le site ────────────────────────
// Les pages du blog sont des HTML statiques (publiés par les routines AIBlogs) :
// on y injecte au build la lecture du thème choisi sur le site (localStorage
// "agentrix_theme") et un bouton clair/sombre, sans toucher aux sources.
{
  const themeInit = `<script>(function(){try{var t=localStorage.getItem("agentrix_theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})();</script>`;
  const toggle = `<button class="themesw" type="button" aria-label="Changer de thème" onclick="(function(){var r=document.documentElement,n=r.getAttribute('data-theme')==='light'?'dark':'light';r.setAttribute('data-theme',n);try{localStorage.setItem('agentrix_theme',n)}catch(e){}})()"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2 12h2.2M19.8 12H22M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"/></svg></button>`;
  const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : e.name === "index.html" ? [join(dir, e.name)] : []);
  let n = 0;
  for (const f of walk(join(DIST, "blog"))) {
    let page = readFileSync(f, "utf8");
    if (page.includes('localStorage.getItem("agentrix_theme")')) continue;
    page = page.replace("</head>", `${themeInit}\n</head>`);
    page = page.replace(/(<header class="post-mini-header">[\s\S]*?)(\n\s*<\/div>\s*<\/header>)/, `$1\n    ${toggle}$2`);
    writeFileSync(f, page);
    n++;
  }
  log(`blog : thème clair/sombre injecté dans ${n} pages`);
}

log("OK → dist/");
