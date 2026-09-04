# SOP 02 — Recherche

**Objectif :** rassembler des preuves sourcées pour que le brouillon ne contienne aucun fait
inventé.

**Responsable :** Claude, avec recherche web (WebSearch/WebFetch) — ce blueprint n'inclut pas de
script Python de recherche automatisée.

## Étapes

1. **Recherche d'autorité** — utiliser la recherche web pour rassembler statistiques actuelles,
   angles concurrents et ce que couvrent déjà les meilleurs résultats sur le mot-clé principal.
   Exiger des **sources Tier 1-3 uniquement** (Tier 1 : recherche primaire/données officielles ;
   Tier 2 : grandes publications ; Tier 3 : sources sectorielles réputées). Rejeter les fermes de
   contenu et pages d'affiliation.
2. **Capturer chaque statistique avec sa source** — chaque affirmation a besoin du chiffre, de
   l'éditeur nommé + titre, de l'URL et de l'année. C'est le "triple de preuve" exigé à la
   rédaction.
3. **Écrire le dossier de recherche** dans `content/research/<slug>.md` avec les sections :
   - Statistiques clés (avec citations complètes)
   - Ce que couvrent déjà les concurrents / ce qui manque
   - Confirmation de l'angle
   - Idées d'image / de schéma
   - Questions candidates pour la FAQ (alimente le GEO + le schéma en aval)
4. **Mettre à jour** `content/topic-queue.md`, statut → `research`.

## Sortie
- `content/research/<slug>.md` (le dossier de preuves consommé par la rédaction).

## Terminé quand
≥ 5 points de données sourcés Tier 1-3 et un angle confirmé.

## Contrôle qualité
- Zéro affirmation non sourcée dans le dossier.
- Aucune source Tier 4-5.
- Au moins 3 questions candidates pour la FAQ.
