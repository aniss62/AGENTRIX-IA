# VOICE.md

> BRAND.md fait autorité sur le positionnement et le périmètre ; VOICE.md fait autorité sur le
> ton et les règles de phrase. Les règles marquées **(garder)** sont des règles de contrôle
> qualité — ne pas les retirer.

## Ton (grille NNGroup à 4 dimensions)
| Axe | Position Agentrix | Ce que ça veut dire |
|-----|--------------------|----------------------|
| Drôle ↔ Sérieux | Surtout sérieux, une pointe d'humour sec sur le jargon IA creux | Crédible pour un dirigeant, jamais bouffon |
| Formel ↔ Familier | Professionnel-décontracté (comme le site : "vous", direct, sans jargon inutile) | Aligné sur `i18n-data.js` : "Vous, vous récupérez des heures chaque semaine." |
| Respectueux ↔ Irrévérencieux | Respectueux, léger agacement face au hype IA non prouvé | On peut pointer une exagération du marché, jamais mépriser le lecteur |
| Enthousiaste ↔ Factuel | Factuel avec conviction | On croit à l'IA agentique parce qu'on la déploie, pas parce qu'elle est à la mode |

## Objectifs de lisibilité (garder — sert de grille de relecture)
- Score de lisibilité visé : clair, accessible, phrases courtes à moyennes (équivalent Flesch
  60-70 en anglais ; en français, viser des phrases qu'on peut lire à voix haute sans reprendre
  son souffle).
- Plafond de phrase : **~25 mots** ; varier la longueur pour le rythme.
- Paragraphes : **≤ 150 mots**, idéalement 2 à 4 phrases.
- Vocabulaire pro-accessible. Définir tout jargon technique (agent, workflow, pipeline...) à sa
  première occurrence.

## Langue
- **Français en priorité** — le français est la langue source du site (`agentrix/i18n-data.js`,
  `window.I18N_FR`). Tous les articles du blog sont rédigés en français d'abord.
- Adresser le lecteur en **"vous"** (vouvoiement), cohérent avec le site.
- Une traduction EN/AR d'un article n'est envisagée qu'à la demande explicite ; elle réutilise
  alors le pipeline i18n existant du site, pas une traduction automatique du markdown brut.

## Posture (personne)
- **"Nous"** éditorial — voix d'équipe Agentrix, cohérente avec le site ("Nous créons des agents
  IA qui..."). Pas de "je" : le blog parle au nom de l'agence, pas d'un auteur individuel.
- Registre **fondé sur l'expérience de déploiement** — partir de ce qu'Agentrix observe chez ses
  clients, pas de théorie générale sur l'IA.
- **Honnête plutôt que promotionnel.** Préférer "voici ce qu'on observe / comment trancher" à
  "nous recommandons X" ; inclure les limites et qui devrait s'abstenir.
- Chaque affirmation garde sa source nommée. (garder)

## Règles de style
- **Réponse d'abord.** Chaque section (H2) ouvre sur la réponse directe en 40-60 mots, puis
  développe. (garder)
- **Sources visibles dans le texte.** "Selon [Éditeur] (2026), ..." plutôt que "des études montrent
  que...". (garder)
- **Autorité de première main pour le "comment faire".** Les affirmations de mise en œuvre
  viennent de l'expérience de déploiement d'Agentrix ("chez nos clients, ça prend environ..."),
  jamais du guide marketing d'un fournisseur tiers. Citer des sources externes uniquement pour
  des faits/statistiques vérifiables. Maximum 1 mention d'un même fournisseur/éditeur par article
  hors liste de sources ; jamais dans les Points Clés ou le schéma FAQ. (garder)
- **Parler à la prochaine action du lecteur.** Relier chaque point à une décision qu'il peut
  prendre aujourd'hui (identifier une tâche à automatiser, demander un audit, comparer une option).
- Utiliser des tournures naturelles, éviter le style administratif/corporate.
- Préférer des verbes concrets et des chiffres précis aux adjectifs vagues.
- Pas de tiret cadratin, tiret demi-cadratin, ni `--` dans la prose. Utiliser virgules,
  points ou parenthèses. (garder — vérifié en QA)
- Ajouter des connecteurs logiques (cependant, par exemple, en effet, résultat) pour la fluidité.
  (garder)

## Étiquette de l'encart résumé
Utiliser **"Points clés"** pour l'encart de synthèse en tête d'article.

## À faire / à éviter
| À faire | À éviter |
|---------|----------|
| Ouvrir sur le chiffre ou la réponse | L'enterrer au 3e paragraphe |
| Nommer la source | Dire "des études montrent" |
| Cadrer comme une décision lecteur ("automatiser maintenant ou attendre ?") | Théorie abstraite sans action |
| Phrases courtes et variées | Phrases longues à empilement de propositions |
| Cas d'usage reproductibles, chiffrés | Hype IA générique ("l'IA va tout changer") |
