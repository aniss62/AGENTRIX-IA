# Design : Agent "Instagentrix" — contenu Instagram quotidien

**Date :** 2026-09-20
**Statut :** Approuvé

---

## Contexte

Agentrix veut alimenter son compte Instagram `@agentrix-ia` avec 2-3 publications par jour
(vidéos courtes et carrousels), sans jamais publier automatiquement — chaque proposition doit
être validée par email avant toute publication. Ce design suit le même principe de gate que
l'agent [[aiblogs_agent|AIBlogs]] déjà en place pour le blog : produire, s'auto-vérifier, envoyer
par email, s'arrêter. Ne jamais publier seul.

Contraintes techniques identifiées avant conception :
- Aucun outil de publication directe Instagram n'est connecté. Zapier propose "Instagram for
  Business" (nécessite un compte Instagram Business/Creator lié à une Page Facebook) mais aucune
  connexion n'existe à ce jour.
- Le compte Higgsfield du projet est en plan gratuit avec **1.44 crédits** — insuffisant pour de
  la génération vidéo IA quotidienne. Le pipeline est donc conçu pour ne dépendre d'aucun crédit
  Higgsfield par défaut.
- Le connecteur Gmail MCP échoue sur les pièces jointes volumineuses (bug documenté dans
  [[aiblogs_agent]]) — donc jamais d'attachment, toujours des liens hébergés.

## Objectif

- Produire chaque jour 2-3 propositions de contenu Instagram (vidéo ou carrousel), cohérentes,
  captivantes, et basées sur des informations récentes (< 3 mois) quand une actualité/statistique
  est citée.
- Envoyer un email quotidien récapitulatif à valider — jamais de publication automatique.
- Ne dépendre d'aucun crédit payant par défaut (Higgsfield en option future uniquement).

---

## Architecture

Deux pièces, même principe que AIBlogs :

1. **Subagent local** `.claude/agents/instagentrix.md` — utilisable en session Claude Code pour
   préparer du contenu à la demande (choix de sujet, recherche, production, auto-QA, packaging).
   N'exécute jamais de publication réelle sans confirmation explicite de l'utilisateur dans la
   session.
2. **Routine cloud quotidienne** "Instagentrix" — se déclenche une fois par jour (proposé : 7h
   Afrique/Casablanca), pioche 2-3 sujets du jour dans la table Airtable "Instagram Content
   Pipeline" en respectant la rotation des piliers, produit le contenu, l'auto-vérifie, envoie
   l'email récapitulatif, et s'arrête. Ne publie jamais.

```
Routine cloud (1x/jour)
  └── Airtable: pioche 2-3 sujets (rotation des 5 piliers)
        └── Pour chaque sujet:
              ├── Format vidéo → texte animé + b-roll libre de droits + musique libre de droits
              │                  (assemblage local ffmpeg, sans voix, sans Higgsfield)
              └── Format carrousel → 4-8 slides brandées (charte Agentrix), génération locale
        └── Si pilier "Actu/tendances" → vérifier la stat via 2 WebSearch indépendantes,
              source datée de < 3 mois, sinon rejeter le sujet et en reprendre un autre
        └── Génère légende + hashtags (~20-25, cf. stratégie ci-dessous)
        └── Héberge chaque média (lien, jamais de pièce jointe)
        └── Met à jour Airtable (statut qa-pass)
        └── Envoie 1 email récap à contact@agentrix-ia.com avec les 2-3 propositions
        └── S'ARRÊTE — aucune publication
```

---

## Piliers de contenu (rotation quotidienne)

| Pilier | Description |
|---|---|
| Conseils/astuces IA pour PME | Tips actionnables sur l'automatisation, les agents IA, la productivité |
| Actu/tendances IA | Décryptage de nouveautés récentes (< 3 mois), angle "ce que ça change pour votre PME" |
| Démonstration des services Agentrix | Mise en avant des 4 piliers Agentrix (automatisation, scraping/leads, sites web, agents de raisonnement) |
| Mythes/idées reçues sur l'IA | Format "vrai ou faux", débunking des peurs courantes des dirigeants de PME |
| Micro-formations Claude | Alterne entre usage business (claude.ai pour dirigeants : rédiger, résumer, automatiser) et usage technique (Claude Code) |

La routine fait tourner les 5 piliers pour qu'aucun ne domine ni ne soit oublié sur une semaine.

---

## Formats de contenu

**Vidéo** (15-30s, 9:16 vertical) :
- Texte animé à l'écran sur fond visuel, deux sources possibles (les deux actives, à choisir par
  sujet — mis à jour 2026-09-22 suite à une demande de l'utilisateur, qui dispose de crédits
  Nano Banana) :
  - **Pixabay** : b-roll vidéo réel libre de droits, via `instagentrix/video.py::search_broll`
    (appel Python direct, clé API requise).
  - **Nano Banana** (Gemini image gen, via le connecteur Zapier Google AI Studio) : une image de
    fond générée par IA, animée en zoom/pan Ken Burns via
    `instagentrix/video.py::build_video_from_image` (ffmpeg `zoompan`), au lieu d'un vrai clip
    vidéo. Cette génération passe par l'outil Zapier depuis une session agent — impossible depuis
    la routine cloud texte-only.
- Musique de fond libre de droits
- Pas de voix off (choix validé — coût nul, pas de dépendance à un moteur de synthèse vocale)
- Sous-titres/texte incrustés via ffmpeg en local (nécessite un ffmpeg avec support `drawtext`,
  voir Prérequis)

**Carrousel** (4-8 slides) :
- Illustration + texte, aux couleurs/police de la charte Agentrix (`agentrix/pages.css`)
- Génération locale (script), aucune dépendance à une génération d'image IA payante

Les deux formats fonctionnent sans crédit Higgsfield. Higgsfield reste une option future (ex.
b-roll généré par IA) si le compte est rechargé, mais n'est jamais utilisé par défaut vu le solde
actuel — toute utilisation future de Higgsfield nécessite confirmation explicite de l'utilisateur
avant d'engager des crédits.

**Choix du format par sujet :** vidéo pour les formats courts/percutants, carrousel quand le sujet
est plus long ou nécessite plusieurs points (ex. "3 erreurs à éviter" en 3 slides).

---

## Fraîcheur des statistiques

Toute statistique, tendance ou actualité citée dans un post "Actu/tendances IA" doit être vérifiée
par 2 recherches WebSearch indépendantes, formulées différemment, confirmant la même source datée
de moins de 3 mois au moment de la génération — même discipline que
[[feedback_verify_stats_before_citing]] pour le blog. Si aucune source récente vérifiable n'est
trouvée, le sujet est écarté et remplacé par un autre du même pilier. Les contenus des autres
piliers (conseils, démo, mythes, formations) ne sont pas soumis à cette contrainte de fraîcheur
sauf s'ils citent eux-mêmes un chiffre daté.

---

## Ciblage géographique

**Pays ciblés (9) :** Maroc, Tunisie, Algérie, Sénégal, Côte d'Ivoire, Cameroun, RD Congo, France,
Canada.

Instagram n'autorise qu'un seul lieu géotaggé par publication (pas de multi-pays sur un même
post) :
- Le **géotag** du jour tourne parmi les grandes villes correspondantes : Casablanca, Tunis,
  Alger, Dakar, Abidjan, Douala, Kinshasa, Paris, Montréal — une ville par post, en rotation.
- Les **hashtags géo** couvrent les 9 pays/villes à chaque post (ex. `#MarocTech` `#FranceTech`
  `#CanadaTech` `#SenegalBusiness`...), donc chaque publication reste indexée pour les 9 marchés
  même si une seule ville est géotaggée ce jour-là.

---

## Stratégie hashtags

~20-25 hashtags par post, répartis en 4 catégories :
- **Larges** (5-6) : `#IA` `#IntelligenceArtificielle` `#Automatisation` `#Entrepreneuriat`
- **Niche/pilier** (5-6) : varie selon le pilier du jour (ex. `#AgentIA`, `#Productivité`,
  `#ClaudeAI`)
- **Marque** (2-3) : `#AgentrixIA` `#Agentrix`
- **Géo** (9) : un hashtag par pays/ville ciblé

Les jeux de hashtags varient d'un post à l'autre (pas de set fixe copié-collé) pour éviter tout
signal de spam Instagram.

---

## Suivi du contenu (Airtable)

Nouvelle table **"Instagram Content Pipeline"** dans la même base que le tracker blog, avec au
minimum :

| Champ | Rôle |
|---|---|
| Sujet | Titre/angle du post |
| Pilier | Un des 5 piliers ci-dessus |
| Format | Vidéo / Carrousel |
| Statut | idea / draft / qa-pass / approved / published |
| Source(s) + date vérifiée | Pour les posts "Actu/tendances", preuve de fraîcheur < 3 mois |
| Ville géotaggée | Ville du jour parmi la liste de rotation |
| Hashtags | Le jeu de hashtags utilisé |
| Lien du média | URL hébergée (jamais de pièce jointe) |
| Date de création / Date de publication | Suivi |

La routine lit cette table pour piocher les sujets du jour et y écrit le statut à chaque étape,
sur le même modèle que le Content Pipeline du blog.

---

## Validation et gate de publication

- Un email quotidien est envoyé à `contact@agentrix-ia.com` avec les 2-3 propositions du jour :
  aperçu (lien hébergé, jamais de pièce jointe — cf. bug Gmail MCP documenté dans
  [[aiblogs_agent]]), légende, hashtags, pilier/source.
- **Aucune publication automatique**, jamais.
- La publication réelle reste à définir par l'utilisateur (décision explicitement reportée) :
  dans un premier temps, publication manuelle par l'utilisateur une fois le contenu vu et validé ;
  une connexion Zapier "Instagram for Business" (nécessite un compte Instagram Business/Creator
  lié à une Page Facebook, à connecter par l'utilisateur) reste une option d'automatisation future
  si souhaitée, jamais activée par défaut.

---

## Nommage

- Subagent : `.claude/agents/instagentrix.md`
- Routine cloud : "Instagentrix", cron proposé `0 7 * * *` Afrique/Casablanca (même réserve que
  AIBlogs sur le décalage UTC pendant le Ramadan, cf. [[aiblogs_agent]])

---

## Hors périmètre (pour cette itération)

- Publication automatique effective sur Instagram (dépend d'une décision future de l'utilisateur)
- Utilisation de Higgsfield pour la génération vidéo/audio (option future si crédits rechargés)
- Voix off (explicitement écarté — texte + musique uniquement)
- Contenu en anglais ou bilingue (français uniquement pour cette itération)
- Curation de vidéos tierces existantes (contenu 100% produit, pas de repost)
