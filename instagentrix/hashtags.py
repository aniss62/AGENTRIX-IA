"""Hashtag pools and per-post selection for Instagentrix.

~22 hashtags per post: 5 broad + 3 brand + 5 niche (pillar-specific) + 9 geo (always all 9,
per docs/superpowers/specs/2026-09-20-instagentrix-design.md).
"""

PILLARS = [
    "conseils-pme",
    "actu-tendances",
    "demo-services",
    "mythes-ia",
    "micro-formations-claude",
]

BROAD_TAGS = [
    "#IA", "#IntelligenceArtificielle", "#Automatisation", "#Entrepreneuriat",
    "#Innovation", "#TechAfrique",
]

BRAND_TAGS = ["#AgentrixIA", "#Agentrix", "#AgentsIA"]

NICHE_TAGS = {
    "conseils-pme": [
        "#ProductivitePME", "#AutomatisationPME", "#GainDeTemps",
        "#OutilsIA", "#TransformationDigitale", "#PMEDigitale",
    ],
    "actu-tendances": [
        "#ActuIA", "#TendancesIA", "#InnovationTech",
        "#IAGenerative", "#FutureOfWork", "#TechNews",
    ],
    "demo-services": [
        "#AgentIA", "#ScrapingLeads", "#SiteWebPerformant",
        "#AutomatisationWorkflow", "#LeadGeneration", "#SolutionsIA",
    ],
    "mythes-ia": [
        "#MythesIA", "#IAExpliquee", "#VraiOuFaux",
        "#DemystifierIA", "#IAAccessible", "#PeurDeIA",
    ],
    "micro-formations-claude": [
        "#ClaudeAI", "#AnthropicAI", "#ApprendreIA",
        "#TutoIA", "#ClaudeCode", "#PromptEngineering",
    ],
}

# One tag per targeted country/city, per docs/superpowers/specs/2026-09-20-instagentrix-design.md
GEO_TAGS = [
    "#MarocTech",       # Casablanca
    "#TunisieTech",     # Tunis
    "#AlgerieTech",     # Alger
    "#SenegalBusiness", # Dakar
    "#CotedIvoireBiz",  # Abidjan (no apostrophe — Instagram hashtags can't contain them)
    "#CamerounTech",    # Douala
    "#RDCongoTech",     # Kinshasa
    "#FranceTech",      # Paris
    "#CanadaTech",      # Montréal
]


def select_hashtags(pillar: str, day_index: int = 0) -> list[str]:
    """Return ~22 hashtags for a post: 5 broad + 3 brand + 5 niche + all 9 geo.

    `day_index` rotates which 5-of-6 broad/niche tags are dropped each day, so consecutive
    posts on the same pillar don't reuse an identical set (avoids Instagram's repetitive-tag
    spam signal).
    """
    if pillar not in NICHE_TAGS:
        raise ValueError(f"Unknown pillar: {pillar!r}. Expected one of {PILLARS}")

    def rotate_drop_one(pool: list[str], seed: int) -> list[str]:
        drop = seed % len(pool)
        return [t for i, t in enumerate(pool) if i != drop]

    broad = rotate_drop_one(BROAD_TAGS, day_index)
    niche = rotate_drop_one(NICHE_TAGS[pillar], day_index + 1)

    return broad + BRAND_TAGS + niche + GEO_TAGS
