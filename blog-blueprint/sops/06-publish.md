# SOP 06 — Publication

**Objectif :** transformer le brouillon validé en une page HTML statique et autonome, cohérente
avec l'identité visuelle du site, puis la déployer.

**Contexte technique important :** Site Agentrix est une SPA sans bundler (React + Babel-standalone
chargés en CDN, routage par hash `#home #product #about...`). `index.html` est la seule page
HTML réellement crawlable pour les moteurs de recherche classiques. Les articles de blog doivent
donc être des **pages HTML statiques séparées** (comme le fait ce blueprint), pas des routes hash
de la SPA — sinon ils resteraient invisibles pour le SEO/GEO.

## Pré-requis
- SOP 05 passée (toutes les règles dures respectées).
- Une image d'en-tête existe pour l'article (dans `image/` ou `agentrix/img/`, cohérente avec le
  reste du site).

## Étapes

1. **Créer le dossier de la page :** `blog/<slug>/index.html` à la racine du dépôt (nouveau
   dossier `blog/` à créer au premier article publié).
2. **Convertir le brouillon en HTML autonome**, en respectant l'identité visuelle du site :
   - Fond sombre `#0c0f15`, accent citron vert `#b8f54a` (cf. `agentrix/styles.css` et le
     favicon SVG dans `index.html`).
   - Polices : Bricolage Grotesque / Sora / Manrope (mêmes imports Google Fonts que
     `index.html`).
   - `<html lang="fr">`, meta description, Open Graph + Twitter Card, canonical.
   - Le JSON-LD rédigé en SOP 04 (`BlogPosting` + `FAQPage` + `Organization`) inséré dans le
     `<head>`.
   - Un lien de retour vers `https://www.agentrix-ia.com/` et, en pied de page, les coordonnées
     du site (contact@agentrix-ia.com, +212 661 151 480) pour rester cohérent.
   - Un CTA en fin d'article (diagnostic gratuit de 30 minutes) — la seule mention promotionnelle
     autorisée par `BRAND.md`.
3. **Mettre à jour `blog/index.html`** (page d'accueil du blog, à créer au premier article) pour
   lister tous les articles publiés, du plus récent au plus ancien.
4. **Mettre à jour `sitemap.xml`** à la racine : ajouter une entrée pour
   `https://www.agentrix-ia.com/blog/<slug>/` (et pour `/blog/` si nouveau).
5. **Lien depuis la SPA (optionnel, hors périmètre de ce blueprint) :** ajouter une entrée "Blog"
   dans la navigation (`agentrix/nav.jsx` + `agentrix/i18n-data.js`) pointant vers `/blog/` est
   une évolution produit à part, à faire consciemment avec l'utilisateur plutôt qu'en automatique
   à chaque article.
6. **Déployer** — voir la mémoire projet *deployment_mechanics* : l'intégration Git ne déploie
   pas automatiquement sur ce projet Vercel. Utiliser `vercel deploy --prod --yes` en CLI après
   avoir commité les fichiers.
7. **Mettre à jour** `content/topic-queue.md`, statut → `published`, avec l'URL live.

## Sortie
- `blog/<slug>/index.html` (l'article, autonome).
- `blog/index.html` mis à jour (index du blog).
- `sitemap.xml` mis à jour.
- URL live sur `www.agentrix-ia.com`.

## Terminé quand
La page est en ligne, s'affiche correctement sur mobile et desktop, et le JSON-LD est valide.

## Contrôle qualité
- La page HTML s'ouvre sans ressource cassée (images correctement référencées).
- JSON-LD présent et valide dans le `<head>`.
- L'index du blog contient un lien vers le nouvel article.
- Cohérence visuelle avec le reste du site (couleurs, polices, ton).
