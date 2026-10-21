// Agentrix — build de production (exécuté par Vercel : `npm run build`)
//
// 1. Copie le site dans dist/
// 2. Compile tous les <script type="text/babel"> de index.html en un seul
//    bundle (esbuild) → plus de Babel ni de compilation dans le navigateur
// 3. Sert React en version production depuis le site (plus de unpkg)
// 4. Pré-rend la page d'accueil en HTML statique dans <div id="root">
//    → les robots (Google, GPTBot, ClaudeBot…) lisent le contenu sans JS
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

// ── 4. Pré-rendu de l'accueil ───────────────────────────────────────────────
const React = require("react");
const ReactDOMServer = require("react-dom/server");

const dom = new JSDOM(`<!DOCTYPE html><html lang="fr"><head></head><body><div id="root"></div></body></html>`, {
  url: SITE_URL, runScripts: "outside-only", pretendToBeVisual: true
});
const w = dom.window;
w.matchMedia = w.matchMedia || ((q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));
w.scrollTo = () => {};
w.React = React;
let rootElement = null;
w.ReactDOM = { createRoot: () => ({ render: (el) => { rootElement = el; } }) };

// Scripts JS classiques (traductions, photo, web component) puis le bundle
for (const [, src] of html.matchAll(/<script src="(agentrix\/(?!vendor\/|app\.)[^"]+)"><\/script>/g)) {
  w.eval(readFileSync(join(ROOT, src), "utf8"));
}
w.eval(bundle);
if (!rootElement) throw new Error("Le bundle n'a pas appelé createRoot().render()");

const prerendered = ReactDOMServer.renderToString(rootElement);
const text = new JSDOM(prerendered).window.document.body.textContent.replace(/\s+/g, " ").trim();
if (text.length < 1000) throw new Error(`Pré-rendu trop court (${text.length} caractères) — vérifier le rendu`);
if (!/<h1[\s>]/.test(prerendered)) throw new Error("Pré-rendu sans <h1>");

if (!html.includes('<div id="root"></div>')) throw new Error('<div id="root"></div> introuvable');
html = html.replace('<div id="root"></div>', `<div id="root">${prerendered}</div>`);
html = html.replace(/<html lang="fr"([^>]*)>/, (m, attrs) => attrs.includes("data-theme") ? m : `<html lang="fr"${attrs} data-theme="dark">`);
log(`Accueil pré-rendu : ${(prerendered.length / 1024).toFixed(0)} Ko de HTML, ${text.length} caractères de texte`);

// ── 4. llms.txt : section Blog générée depuis blog/*/index.html ──────────────
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

writeFileSync(join(DIST, "index.html"), html);
log("OK → dist/");
