# Design : Instagentrix multi-client (skill d'onboarding + moteur générique)

**Date :** 2026-09-24
**Statut :** Approuvé

---

## Contexte

Instagentrix existe aujourd'hui uniquement pour Agentrix : couleurs, police, wordmark, piliers de
contenu, hashtags, villes géotaguées et compte Instagram sont codés en dur dans
`instagentrix/brand.py`, `instagentrix/hashtags.py` et `instagentrix/geo.py`. La routine cloud
"Instagentrix" (`trig_01Vn6yBMYeKWuxK7RqQAA6G1`) publie désormais réellement sur Instagram via
Zapier une fois qu'un post atteint le statut `media-ready` (voir [[instagentrix_agent]]).

L'objectif est de proposer ce même service à d'autres clients d'Agentrix, sans dupliquer le code
ni retaper une nouvelle routine à la main à chaque fois.

## Objectif

- Un **skill invocable** qui, pour un nouveau client, pose les questions nécessaires (activité,
  cible, image de marque, comptes à connecter) puis provisionne tout : config, base Airtable,
  routine cloud.
- Le moteur de génération (carrousel, vidéo, hashtags, géociblage) devient **générique**, piloté
  par un fichier de config par client au lieu de constantes en dur.
- Agentrix devient un client parmi d'autres dans ce système (aucune régression sur la routine
  actuelle).
- Les étapes qui ne peuvent objectivement pas être automatisées (autorisation Instagram/Facebook
  côté client dans Zapier, attachement du connecteur Zapier à la nouvelle routine) restent
  manuelles, mais le skill les liste explicitement avec les instructions exactes.

## Hors périmètre

- Automatiser l'autorisation OAuth Zapier/Facebook elle-même (impossible sans navigateur côté
  client).
- Un produit SaaS avec interface client — ceci reste un outil interne qu'Aniss opère depuis Claude
  Code pour le compte de ses clients, pas quelque chose que le client configure lui-même.
- Migrer l'historique déjà publié d'Agentrix — sa config est une photographie de l'état actuel,
  pas une réécriture de ce qui a déjà tourné.
- Génération vidéo cloud (b-roll) — reste une limitation connue de l'environnement cloud, valable
  pour tous les clients comme pour Agentrix aujourd'hui.

---

## Architecture

```
instagentrix/
  clients/
    agentrix/
      config.json          ← migration telle quelle de l'état actuel d'Agentrix
    <slug-client>/
      config.json          ← généré par le skill d'onboarding
  brand.py                 → devient un loader : load_client(slug) -> ClientConfig
  hashtags.py               → select_hashtags(config, pillar, day_index)
  geo.py                    → city_for_day(config, day)
  carousel.py, video.py     → prennent un ClientConfig en paramètre au lieu d'importer brand.*
  media/<slug>/             ← au lieu de media/ à plat (évite les collisions entre clients)
  output/<slug>/            ← idem, toujours gitignored
```

Un dossier par client sous `clients/` regroupe tout ce qui est spécifique — pas de base de données
séparée, pas de dépendance externe nouvelle.

### Schéma `config.json`

```json
{
  "slug": "exemple-client",
  "display_name": "Exemple Client",
  "instagram_handle": "@exemple_client",
  "activity_summary": "Cabinet comptable pour PME à Casablanca",
  "languages": ["fr"],
  "brand": {
    "wordmark": "ExempleClient",
    "font_display_bold": "SpaceGrotesk-Bold.ttf",
    "bg": "#0a0c10", "bg_2": "#101216", "surface": "#15171c", "surface_2": "#1d2026",
    "text": "#f5f7f9", "muted": "#a7abb3", "faint": "#71757c",
    "accent": "#aeec46", "accent_dim": "#98cb46", "accent_ink": "#121f00"
  },
  "pillars": [
    {"key": "conseils-pme", "label": "Conseils pratiques", "niche_tags": ["#Comptabilite", "..."]}
  ],
  "geo": {
    "cities": ["Casablanca"],
    "geo_tags": ["#MarocTech"]
  },
  "hashtags": {
    "broad": ["#IA", "..."],
    "brand": ["#ExempleClient"]
  },
  "airtable": {"base_id": "appXXXXXXXXXXXXXX", "table_id": "tblXXXXXXXXXXXXXX"},
  "contact_email": "contact@exemple-client.com",
  "instagram_page_id": "179...",
  "zapier_connection_id": "..."
}
```

Les polices restent limitées à une **shortlist pré-validée libre de droits** (Space Grotesk,
General Sans, Archivo — déjà envisagées pour Agentrix, voir [[instagentrix_carousel_style]]) pour
ne jamais introduire de police sous licence propriétaire par accident ; le skill propose la
shortlist plutôt que d'accepter un nom de police arbitraire.

---

## Le skill d'onboarding

Nouveau fichier `.claude/skills/instagentrix-onboarding/SKILL.md`, invocable en session Claude
Code. Déroulé :

1. **Entretien** (questions one-at-a-time, comme un mini-brainstorming) : nom/activité du client,
   audience cible et pays/villes, ton de marque et couleur(s) dominante(s), choix de police dans la
   shortlist, poignée Instagram, 4-6 piliers de contenu adaptés à son activité (proposés par
   Claude à partir de la description, validés par l'utilisateur), email de relecture.
2. **Provisioning Airtable** : clone la table "Instagram Content Pipeline" (mêmes types de champs
   que `tblUIyuUGAOB33A4M`, statuts identiques `idea → brief-sent → approved → media-ready →
   published → blocked`) dans une nouvelle base (ou nouvelle table dans la base `agentrix` — à
   trancher au moment de l'implémentation selon ce que permet l'outil Airtable MCP
   `create_base`/`create_table`/`create_field`).
3. **Écrit `instagentrix/clients/<slug>/config.json`** avec tout ce qui précède.
4. **Crée la routine cloud** via `RemoteTrigger action: create`, prompt généré à partir du même
   gabarit Phase A (publication) + Phase B (nouveaux briefs) que la routine Agentrix actuelle,
   substituant systématiquement : base/table Airtable, pillars, contact_email, instagramPageId.
   Connecteurs demandés : Airtable + Gmail (déjà partagés, même compte) + Zapier.
5. **Fin de session : checklist des 2 étapes manuelles obligatoires**, affichée clairement :
   - Le client autorise son compte Instagram Business (lié à sa Page Facebook) dans Zapier, sous
     le compte Zapier d'Aniss — comme "Agentrix-IA" aujourd'hui parmi les Pages déjà connectées.
   - Aniss attache le connecteur Zapier à la nouvelle routine via claude.ai/code/routines (aucun
     outil ne permet de le faire par API, confirmé lors du travail sur Agentrix).
   Le skill ne peut pas se déclarer "terminé" tant que ces deux points n'ont pas été confirmés par
   l'utilisateur — jamais de routine laissée à moitié câblée sans avertissement explicite.

---

## Migration d'Agentrix

`instagentrix/clients/agentrix/config.json` reprend exactement l'état actuel : couleurs/police de
`brand.py`, 5 piliers + hashtags de `hashtags.py`, 9 villes de `geo.py`, `airtable.base_id =
appcoqhKXGbCttULR` / `table_id = tblUIyuUGAOB33A4M`, `instagram_page_id = 17841437764601776`,
`contact_email = contact@agentrix-ia.com`. La routine cloud existante
(`trig_01Vn6yBMYeKWuxK7RqQAA6G1`) est mise à jour pour lire ce fichier de config au lieu de valeurs
en dur dans son prompt, mais son comportement observable ne change pas.

---

## Risques et points de vigilance

- **Compte Zapier partagé entre tous les clients** : chaque nouvelle connexion Instagram/Facebook
  s'ajoute au même compte Zapier d'Aniss (on l'a déjà vu : plusieurs Pages telles que "fiyadila" ou
  "Silence Sabine" y sont déjà connectées). Pas de cloisonnement technique entre clients au niveau
  Zapier — juste une discipline sur quel `instagramPageId`/`zapier_connection_id` est utilisé par
  quelle routine. À documenter clairement pour éviter qu'une routine publie sur le mauvais compte.
- **Toutes les routines cloud tournent sous le compte claude.ai d'Aniss** : c'est lui qui reste
  facturé/limité par son propre plan pour l'usage de toutes les routines clients, pas les clients
  eux-mêmes (cf. discussion coûts du 2026-09-24 sur ce même fil).
- **Pas de garde-fou technique empêchant un prompt de routine mal généré de lire/écrire la
  mauvaise base Airtable** — la génération du prompt de routine doit être testée (dry-run visuel du
  prompt généré) avant `RemoteTrigger create`, pas juste templaté à l'aveugle.
