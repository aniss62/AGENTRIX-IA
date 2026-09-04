# SOP 00 — Routage des skills

Deux skills Claude Code globales gèrent l'optimisation d'un article, installées dans
`~/.claude/skills/` (voir `blog-blueprint/README.md` pour l'origine) :

| Job | Utiliser | Pas |
|-----|----------|-----|
| Optimiser le SEO classique (intention, mots-clés, titre, meta, hiérarchie de titres, maillage interne, alt) | **`on-page-seo`** | — |
| Optimiser les citations IA / GEO (extractibilité, citabilité, présence d'entité, prose AI-first) | **`ai-seo`** | — |
| GEO MENA / Arabe (si un article est un jour traduit en arabe) | **`ai-seo`** (playbook MENA/Arabe intégré) | — |

## Ordre du passage à deux temps (dans la SOP 04)
1. **`on-page-seo` d'abord** — corrige l'intention, le titre, la meta, l'URL, la structure de
   titres et le placement des mots-clés. Il délègue ensuite l'accroche + le corps de la prose à
   la passe GEO (pour ne pas réécrire le texte deux fois).
2. **`ai-seo` ensuite** — met l'information en avant, rend les blocs extractibles, retire le ton
   promotionnel du H1 et du corps. En cas de tension entre les deux, **la règle anti-bourrage /
   écriture naturelle d'`ai-seo` l'emporte** sur le corps de texte.

## Pourquoi ce découpage
Faire tourner les deux skills comme "optimiseurs" en parallèle réécrirait la prose deux fois et
créerait des contradictions. Faire-puis-vérifier l'évite : `on-page-seo` puis `ai-seo` optimisent ;
la SOP 05 (QA) vérifie manuellement avec la check-list, sans script Python (ce blueprint n'inclut
pas la chaîne d'outils Python/autopilot du dépôt d'origine, par choix de portée).
