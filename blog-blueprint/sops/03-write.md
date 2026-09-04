# SOP 03 — Rédaction

**Objectif :** produire un premier brouillon qui répond d'abord, sourcé, conforme au template et
au ton Agentrix, **en français**.

**Responsable :** Claude, en chargeant `blueprints/brand/BRAND.md` + `VOICE.md` et le template
choisi.

## Étapes

1. **Charger la marque + le ton** — `blog-blueprint/brand/BRAND.md` et `VOICE.md` définissent le
   positionnement, l'audience, les expressions interdites, le ton et le plafond de phrase.
   Toujours les relire avant d'écrire, ne pas se fier à la mémoire d'une session précédente.
2. **Choisir le template** dans `blog-blueprint/templates/` (retenu à l'intake : how-to-guide,
   listicle, comparison, pillar-page, etc.). Suivre sa structure de sections et sa cible de
   longueur.
3. **Rédiger le brouillon en français**, en s'appuyant sur `content/research/<slug>.md`.
   Appliquer les 6 piliers :
   - **Réponse d'abord** : chaque H2 ouvre sur une réponse directe de 40-60 mots, riche en
     chiffres.
   - **Données réelles sourcées** : attribution en ligne pour chaque chiffre (issu du dossier).
   - **Structure** : blocs de 50-150 mots, titres formulés comme des questions quand pertinent,
     hiérarchie H1→H2→H3 (jamais de saut de niveau).
   - **Bloc FAQ** : 3+ questions/réponses de 40-60 mots (surface GEO + alimente le schéma).
   - **Média visuel** : image d'en-tête + au moins un visuel avec texte alternatif descriptif.
   - **Fraîcheur** : ancrer l'année en cours dans le texte ; prévoir une date de mise à jour.
4. **Enregistrer** le brouillon dans `content/posts/<slug>.md` avec un en-tête (frontmatter) :
   titre, description, slug, mot-clé principal, date, date de mise à jour, tags, pilier de
   service concerné.
5. **Mettre à jour** `content/topic-queue.md`, statut → `draft`.

## Sortie
- `content/posts/<slug>.md` (brouillon markdown avec en-tête).

## Terminé quand
Le brouillon est complet, conforme au template, chaque chiffre est attribué, un bloc FAQ existe.

## Contrôle qualité (règles dures — ne jamais laisser passer un brouillon qui les viole)
- Aucune statistique inventée (chaque chiffre remonte à `content/research/<slug>.md`).
- Aucun paragraphe > 150 mots.
- Aucun saut de niveau de titre.
- ≤ 1 mention promotionnelle (uniquement en fin d'article, contexte CTA).
- Aucun tiret cadratin, tiret demi-cadratin, ni `--` dans la prose (vérifié en SOP 05).
