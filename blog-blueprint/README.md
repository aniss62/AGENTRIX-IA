# Blog Blueprint — Agentrix

Blueprint éditorial pour générer les articles du blog Agentrix : marque, ton, templates, SOPs et
skills d'optimisation SEO/GEO. Adapté du système
[geo-seo-blog-engine-system](https://github.com/zarahunter/geo-seo-blog-engine-system)
de Zara Hunter (MIT), en version allégée : **pas de scripts Python, pas d'autopilot** — seuls le
contenu (marque, ton, templates, procédures) et les deux skills d'optimisation ont été repris.

## Ce qui a été installé globalement
Deux skills Claude Code, dans `~/.claude/skills/` (disponibles dans toutes tes sessions, pas
seulement ce projet) :
- **`on-page-seo`** — optimise le classement classique (Google/Bing) : intention, mots-clés,
  titre, meta, titres, maillage interne, alt.
- **`ai-seo`** — optimise pour être cité par ChatGPT, Perplexity, AI Overviews, Gemini, Claude
  (GEO), y compris le playbook MENA/Arabe.

## Ce qu'il y a ici
```
blog-blueprint/
├── brand/
│   ├── BRAND.md          # positionnement, audience, périmètre, monétisation — rempli pour Agentrix
│   └── VOICE.md           # ton, lisibilité, règles de style, français en priorité
├── calendar.md             # clusters de sujets (les 4 piliers de service), cadence
├── sops/                   # les 6 étapes du pipeline, une procédure par fichier
│   ├── 00-skill-routing.md
│   ├── 01-intake.md
│   ├── 02-research.md
│   ├── 03-write.md
│   ├── 04-optimize-seo-geo.md
│   ├── 05-qa.md
│   └── 06-publish.md
├── templates/               # 12 templates de structure (how-to, listicle, comparatif, pilier...)
└── content/
    ├── topic-queue.md       # file d'attente des sujets, un tableau
    ├── research/             # dossiers de preuves sourcées, un par article (<slug>.md)
    └── posts/                # brouillons markdown, un par article (<slug>.md)
```

## Comment l'utiliser
Dire à Claude, dans ce projet :
> "écris un article de blog sur [sujet]"

ou, pour laisser le calendrier proposer un angle :
> "quel article devrait-on écrire cette semaine ?"

Claude suit alors le pipeline en 6 étapes (Intake → Recherche → Rédaction → Optimisation →
QA → Publication), chaque étape documentée dans `sops/`, en chargeant `brand/BRAND.md` et
`brand/VOICE.md` avant d'écrire. Les articles sortent en français, conformes à l'identité
Agentrix, optimisés SEO + GEO, avant d'être transformés en page HTML statique sous `blog/`
(voir `sops/06-publish.md` pour l'intégration au site).

## Portée volontairement réduite
Ce blueprint n'inclut pas (par choix, pas par oubli) :
- Le scoreur qualité Python (`analyze_blog.py`), le linter de prose, le rendu HTML automatisé —
  remplacés par une check-list manuelle (`sops/05-qa.md`) et une conversion manuelle en HTML
  (`sops/06-publish.md`).
- L'autopilot (recherche de sujets tendance automatisée, sprint hebdomadaire) — remplacé par un
  calendrier de clusters (`calendar.md`) que tu pilotes toi-même.
- Le suivi Airtable/Google Sheet des citations IA du dépôt d'origine.

Si le volume d'articles augmente, ces automatisations pourront être reprises du dépôt d'origine
et ajoutées ici sans casser ce qui existe déjà.
