# SOP 04 — Optimisation (SEO + GEO)

**Objectif :** faire en sorte que le brouillon se classe dans la recherche classique ET soit cité
par les moteurs de réponse IA.

**Responsable :** Claude, via les skills globales `on-page-seo` puis `ai-seo`
(voir `blog-blueprint/sops/00-skill-routing.md`).

Faire tourner les deux passes dans l'ordre. Elles sont complémentaires, pas alternatives.

## Passe A — Recherche classique (`on-page-seo`)
Invoquer la skill `on-page-seo` sur `content/posts/<slug>.md`. Vérifier / corriger :
- Correspondance d'intention (le contenu répond-il au type de requête visé ?)
- Mot-clé principal présent dans : titre, H1, 100 premiers mots, ≥1 H2, slug d'URL, meta
  description.
- Titre 50-60 caractères ; meta description 150-160 caractères.
- Hiérarchie de titres propre (H1→H2→H3).
- Zones de maillage interne (vers les pages de service Agentrix pertinentes) + ancres descriptives.
- Texte alternatif présent et naturellement enrichi de mots-clés sur chaque image.

## Passe B — Réponses IA / GEO (`ai-seo`)
Invoquer la skill `ai-seo` sur `content/posts/<slug>.md`. Vérifier / corriger :
- Passages prêts à l'extraction (les ouvertures "réponse d'abord").
- Présence et clarté des entités (le "qui/quoi" est sans ambiguïté pour un LLM — nommer
  "Agentrix", les 4 familles de services, explicitement).
- Formatage Q&A / FAQ avec réponses autonomes de 40-60 mots.
- Affirmations citables et sourcées avec éditeurs nommés.

## Passe C — Données structurées
Pas d'outil automatisé de génération de schéma dans ce blueprint. Rédiger manuellement le
JSON-LD (`BlogPosting`, `FAQPage`, `Organization` pour Agentrix) à partir du frontmatter et du
bloc FAQ de l'article, à intégrer au moment de la publication (SOP 06).

## Sortie
- `content/posts/<slug>.md` optimisé.
- JSON-LD prêt (inline dans le brouillon ou en note pour la publication).

## Terminé quand
Les deux passes ne signalent plus de blocage et le JSON-LD est rédigé.

## Contrôle qualité
- Titre + meta dans les limites de longueur.
- Placement du mot-clé principal complet (sans sur-optimisation).
- Réponses FAQ autonomes et prêtes à l'extraction.
- JSON-LD valide (structure vérifiée à l'œil ou via un validateur en ligne avant publication).
