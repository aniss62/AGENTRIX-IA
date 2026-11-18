# SOP 03b — Illustrations (une identité visuelle propre à chaque article)

**Objectif :** chaque article publié a une illustration d'en-tête **unique, riche et spécifique à
son sujet**, plus au moins un visuel de données. Plus jamais le même schéma "cercles reliés par des
traits" d'un article à l'autre.

**Quand :** après la rédaction (SOP 03), avant la QA (SOP 05). Le résultat est un SVG inline dans
le HTML de l'article (le routine envoie l'article en un seul bloc HTML, donc pas de fichier image
séparé).

## Étapes

1. **Trouver la métaphore du sujet.** Une phrase : "Quel objet ou scène concrète représente
   l'idée centrale de cet article ?" (une balance de coûts, un entonnoir, un bouclier RGPD, un
   tableau de bord, un cadran, une pile de documents, un circuit...). Pas un schéma générique
   "source → agent → sorties".
2. **Vérifier la non-répétition.** Lire les `<svg viewBox="0 0 760 320">` d'en-tête des articles
   déjà publiés dans `blog/*/index.html`. Refuser toute composition dont la structure (disposition
   des formes, nombre de nœuds, flux gauche→droite) ressemble à l'une d'elles. Varier aussi la
   disposition : centrée, diagonale, en couches, en grille, radiale, isométrique, jauge.
   **Les `id` internes du SVG (`pattern`, `gradient`) sont préfixés par 2 lettres propres à
   l'article** (ex. `ct`, `cv`) : l'illustration est recopiée telle quelle dans la carte de
   `blog/index.html`, tous les SVG se retrouvent donc sur une même page.
3. **Dessiner l'illustration riche** (viewBox `0 0 760 320`, `role="img"`, `aria-label` descriptif) :
   - Palette de marque uniquement : fond `#0c0f15`, accent `#b8f54a`, texte `#eef0f3`, gris
     `#9aa0ab`, surfaces `#151922` / `#1c212c`. L'accent reste rare et sert à guider l'œil.
   - **Au moins 4 couches de profondeur** : fond (grille de points, lignes de repère ou halo via
     `radialGradient`), forme principale (la métaphore), éléments secondaires (étiquettes,
     micro-icônes, graduations), détails (points lumineux, traits d'ombre, `opacity` étagées).
   - **Au moins un élément chiffré ou textuel réel de l'article** (un chiffre sourcé, un libellé
     de la section Sources), jamais un chiffre inventé pour décorer.
   - Utiliser `linearGradient` / `radialGradient`, `stroke-dasharray`, `opacity` et formes
     arrondies pour la richesse ; pas de bitmap embarqué, pas de police externe autre que
     Manrope / JetBrains Mono / Bricolage Grotesque.
   - Lisible en 320 px de large (texte ≥ 10 unités du viewBox, contraste suffisant).
4. **Des visuels dans le corps de l'article, pas seulement en en-tête** (règle ajoutée le
   2026-11-18 : un article dont seul l'en-tête est illustré est refusé). Au minimum **4 schémas
   SVG** répartis dans les sections, en plus de l'en-tête, chacun dans
   `<figure class="chart-figure">` + `<figcaption>`, viewBox `0 0 760 260`, mêmes conventions
   que l'en-tête (palette, couches de profondeur, `id` préfixés, `aria-label`). Choisir à chaque
   fois le bon type de visuel : comparaison côte à côte (A contre B), processus en étapes
   (une carte par étape), familles ou catégories (colonnes avec icônes), chiffre clé en barres
   ou jauge, chronologie. Un schéma par grande section (définition, méthode, cadre légal ou
   risque, chiffre clé), jamais deux schémas du même type à la suite. **Chaque libellé et chaque
   chiffre d'un schéma vient du texte de l'article** (aucune information nouvelle) et un
   graphique chiffré cite sa source dans la légende. Ne jamais modifier le texte pour caser un
   visuel : le visuel s'insère entre deux blocs existants.
5. **Accessibilité** : `aria-label` sur chaque `<svg>`, `figcaption` pour les graphiques, aucune
   information portée uniquement par la couleur.
6. **Enregistrer la métaphore choisie** dans la note de QA (une ligne : "Illustration : balance
   coût manuel vs agent IA") pour que les articles suivants évitent de la reproduire.

## Terminé quand
L'article contient une illustration d'en-tête reconnaissable en un coup d'œil comme propre à son
sujet, différente de toutes celles déjà publiées, et au moins 4 schémas dans le corps.

## Contrôle qualité (ajouté à la SOP 05)
- [ ] Illustration d'en-tête distincte de celles des articles déjà publiés (métaphore + composition).
- [ ] ≥ 4 couches de profondeur, palette de marque, aucun chiffre décoratif inventé.
- [ ] ≥ 4 schémas dans le corps de l'article, libellés issus du texte, légendes sourcées.
- [ ] `aria-label` descriptif sur chaque SVG, lisible en mobile.
