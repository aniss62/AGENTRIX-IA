# SOP 01 — Intake

**Objectif :** transformer un sujet brut en un travail cadré et journalisé.

**Déclencheur :** l'utilisateur dit "écris un article sur X" / "blog sur X" / donne un sujet, ou
demande "sur quoi devrait-on écrire".

**Responsable :** Claude, à partir de `calendar.md` et `content/topic-queue.md`.

## Étapes

1. **Si le sujet est large ou non donné** — proposer 2-3 angles tirés des clusters de
   `blog-blueprint/calendar.md`, en croisant avec ce qui n'a pas encore été traité dans
   `content/topic-queue.md`. Laisser l'utilisateur choisir.
2. **Capturer le sujet** tel que donné (ou choisi).
3. **Dériver un slug** — minuscules, kebab-case, sans mot vide évitable
   (ex. "Comment l'IA change la génération de leads" → `ia-generation-leads`).
4. **Fixer les défauts, ne demander confirmation que si ambigu :**
   - Mot-clé principal (meilleure estimation à partir du sujet)
   - Template cible (voir `blog-blueprint/templates/` ; défaut `how-to-guide`)
   - Pilier de service concerné (un des 4 piliers de `BRAND.md`, ou transverse)
   - Angle / prise de position (1 ligne)
5. **Journaliser** une nouvelle ligne dans `content/topic-queue.md`, statut `intake`.

## Sortie
- Une ligne dans `content/topic-queue.md`.

## Terminé quand
Slug + mot-clé principal + template sont fixés et journalisés. Passer à **SOP 02 — Recherche**.

## Contrôle qualité
- Le slug est unique (pas de collision dans `content/posts/` ni dans la file).
- Un seul mot-clé principal choisi (vérifier l'absence de cannibalisation avec un article déjà
  publié ou en cours ; si chevauchement, différencier l'angle ou fusionner).
