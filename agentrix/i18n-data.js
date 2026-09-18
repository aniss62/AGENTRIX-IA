// Agentrix-IA — Table i18n dédiée (données pures, chargées sans Babel)
// FR = source de vérité · EN · AR. Une seule table consolidée: window.I18N.

window.I18N_FR = {
  nav: {
    home: "Accueil",
    product: "Produit",
    about: "À propos",
    blog: "Blog",
    testimonials: "Témoignages",
    contact: "Contact",
    cta: "Nous contacter"
  },
  common: {
    getStarted: "Démarrer",
    talkToUs: "Parler à un expert",
    learnMore: "En savoir plus",
    explore: "Explorer",
    perWeek: "par semaine",
    backHome: "Retour à l'accueil"
  },
  home: {
    hero: {
      badge: "Agence d'IA agentique",
      titleA: "Des agents autonomes qui",
      titleHi: "travaillent à votre place.",
      sub: "Nous créons des agents IA qui réfléchissent, s'organisent et accomplissent vos tâches les plus chronophages. Vous, vous récupérez des heures chaque semaine.",
      cta1: "Nous contacter",
      cta2: "Voir le produit",
      s1: "h récupérées / sem.",
      s2: "agents déployés",
      s3: "de tâches automatisées"
    },
    logos: { label: "Ils automatisent avec Agentrix" },
    pillars: {
      eyebrow: "Ce que font nos agents",
      title: "Un collègue numérique pour chaque tâche qui revient sans cesse.",
      sub: "Quatre familles d'agents, pensées pour vous et connectées à vos outils.",
      included: "Ce qui est inclus",
      items: [
        { tag: "01 · Automatisation", title: "Automatisation de workflows",
          desc: "Vos tâches répétitives gérées de bout en bout, jour et nuit, sans que vous ayez à y penser.",
          long: "Relances, saisies, rapports, synchronisations : tout ce qui vous prend du temps chaque jour est pris en charge par des agents qui travaillent en continu, sans jamais perdre le fil.",
          points: ["Relances et suivis automatiques", "Synchronisation entre vos outils", "Rapports générés sans intervention", "Déclencheurs et règles sur mesure"],
          metric: { value: "≈16h", label: "récupérées / semaine" } },
        { tag: "02 · Acquisition", title: "Scraping & leads qualifiés",
          desc: "On identifie, on enrichit et on qualifie vos prospects, à grande échelle.",
          long: "Des agents qui repèrent, enrichissent et qualifient vos prospects en continu, pour remplir votre pipeline de contacts qui comptent vraiment.",
          points: ["Détection de prospects ciblés", "Enrichissement des données de contact", "Qualification selon vos critères", "Export direct vers votre CRM"],
          metric: { value: "3,4×", label: "de leads qualifiés" } },
        { tag: "03 · Web", title: "Sites à forte conversion",
          desc: "Des sites modernes, rapides et soignés, faits pour transformer vos visiteurs en clients.",
          long: "Des sites modernes, rapides et bien référencés, pensés pour convertir. Notre équipe les conçoit, les développe et vous les livre clés en main.",
          points: ["Design sur mesure et responsive", "Performances et SEO optimisés", "Parcours pensés pour convertir", "Livraison en quelques semaines"],
          metric: { value: "×2", label: "de taux de conversion" } },
        { tag: "04 · Décision", title: "Agents de raisonnement",
          desc: "Des agents qui planifient, décident et s'adaptent à vos règles métier.",
          long: "Des agents capables de découper un objectif, de planifier les étapes, de décider et de s'adapter à vos règles métier. Et quand il le faut, un humain garde la main.",
          points: ["Décomposition d'objectifs complexes", "Planification et exécution autonomes", "Adaptation aux règles métier", "Validation humaine optionnelle"],
          metric: { value: "24/7", label: "de disponibilité" } }
      ]
    },
    how: {
      eyebrow: "Comment ça marche",
      title: "De l'audit au déploiement, en trois étapes.",
      steps: [
        { n: "01", title: "Audit & cartographie", desc: "On analyse vos workflows ensemble et on repère où le temps file sur les tâches répétitives." },
        { n: "02", title: "Conception des agents", desc: "On conçoit des agents taillés pour vous, branchés à vos outils et à vos données." },
        { n: "03", title: "Déploiement & pilotage", desc: "Mise en route, suivi au quotidien et améliorations continues des performances." }
      ]
    },
    metrics: {
      eyebrow: "Impact mesurable",
      title: "Le temps que vous récupérez, en chiffres.",
      items: [
        { value: "≈16h", label: "récupérées par semaine et par équipe" },
        { value: "90%", label: "des tâches répétitives automatisées" },
        { value: "3,4×", label: "de leads qualifiés en plus" },
        { value: "< 4 sem.", label: "du premier appel à la mise en production" }
      ]
    },
    cta: {
      title: "Et si vos tâches répétitives tournaient toutes seules ?",
      sub: "Demandez un diagnostic gratuit de 30 minutes. On identifie ensemble vos trois premiers agents à fort impact.",
      btn: "Demander mon diagnostic"
    },
    tmoni: {
      eyebrow: "Ils nous font confiance",
      title: "Des équipes plus légères, des résultats concrets.",
      sub: "Ce que racontent les clients qui ont déployé nos agents.",
      photo: "photo client"
    },
    faq: {
      eyebrow: "Questions fréquentes",
      title: "Tout comprendre sur nos services agentiques.",
      sub: "On répond ici aux questions qu'on nous pose le plus souvent.",
      items: [
        { q: "Qu'est-ce qu'un agent IA autonome ?", a: "C'est un programme intelligent qui observe son environnement, planifie ses étapes et accomplit des tâches complexes dans vos outils, sans supervision constante. Un vrai collègue numérique, en somme." },
        { q: "Quels types de tâches pouvez-vous automatiser ?", a: "Relances commerciales, qualification de leads, saisie de données, rapports, support de niveau 1, synchronisations entre outils… En clair, toute tâche répétitive qui vous prend du temps." },
        { q: "Faut-il des compétences techniques de notre côté ?", a: "Non, rassurez-vous. On conçoit, on déploie et on pilote les agents pour vous. Vous gardez la main grâce à un tableau de bord simple et clair." },
        { q: "Comment mesurez-vous les résultats ?", a: "En heures gagnées et en valeur créée. Chaque action d'un agent est traçable, et vous suivez l'impact en temps réel sur votre tableau de bord." },
        { q: "Et si nos besoins évoluent ?", a: "Les agents évoluent avec vous. On les optimise en continu, et vous pouvez en ajouter, en modifier ou en arrêter un à tout moment." }
      ]
    },
    lead: {
      eyebrow: "Démarrons",
      title: "Parlez-nous de votre projet.",
      sub: "Laissez-nous vos coordonnées : un expert vous rappelle sous 24 h avec vos premiers agents à fort impact.",
      fName: "Nom",
      fFirst: "Prénom",
      fEmail: "E-mail",
      fProject: "Votre projet",
      fProjectPh: "Dites-nous en quelques mots ce que vous aimeriez automatiser…",
      optional: "(optionnel)",
      required: "Champ requis",
      emailInvalid: "Adresse e-mail invalide",
      submit: "Être recontacté",
      sending: "Envoi…",
      success: "Merci, c'est bien reçu ✓",
      successSub: "Notre équipe revient vers vous sous 24 h.",
      again: "Envoyer une autre demande"
    },
    chat: {
      launcher: "Une question ?",
      title: "Agent Agentrix",
      status: "En ligne · répond en quelques secondes",
      welcome: "Bonjour 👋 Je suis l'agent Agentrix. Posez-moi vos questions sur nos services agentiques, ou choisissez ci-dessous.",
      intro: "Suggestions",
      more: "Autres questions",
      inputPlaceholder: "Écrivez votre message…",
      typing: "L'agent écrit…",
      fallback: "Bonne question ! Pour une réponse vraiment précise, le mieux est d'en parler de vive voix. Laissez-moi vos coordonnées juste ici 👇",
      leadIntro: "Parfait ! Laissez-moi vos coordonnées et notre équipe vous rappelle sous 24 h.",
      restart: "Recommencer",
      items: [
        { q: "Que faites-vous exactement ?", a: "On conçoit et on déploie des agents IA autonomes qui automatisent vos tâches répétitives, vont chercher des leads qualifiés et créent des sites qui convertissent. Au final, vous gagnez des heures chaque semaine." },
        { q: "Combien de temps pour déployer un agent ?", a: "En général moins de 4 semaines, du premier appel à la mise en production, selon la complexité de votre workflow." },
        { q: "Quels outils pouvez-vous intégrer ?", a: "CRM, e-mail, bases de données, Slack, Notion, Stripe… plus de 200 intégrations. Vos agents agissent là où vous travaillez déjà." },
        { q: "Mes données sont-elles en sécurité ?", a: "Oui : chiffrement de bout en bout, hébergement européen et déploiement on-premise possible pour les besoins sensibles." },
        { q: "Combien ça coûte ?", a: "Tout dépend de ce que vous voulez automatiser. Le mieux, c'est un diagnostic gratuit : on estime ensemble le périmètre et on vous donne un budget clair, sans engagement." }
      ],
      leadQ: "Je veux être recontacté",
      secEyebrow: "Assistant en ligne",
      secTitle: "Discutez avec notre agent IA.",
      secSub: "Posez votre question, ou cliquez sur l'une des suggestions ci-dessous."
    }
  },
  product: {
    hero: {
      eyebrow: "Le produit",
      title: "Une plateforme d'agents qui réfléchissent, s'organisent et passent à l'action.",
      sub: "Chaque agent Agentrix observe son environnement, découpe un objectif en étapes, agit dans vos outils et apprend de chaque exécution."
    },
    capabilities: {
      eyebrow: "Capacités",
      title: "Tout ce dont un agent autonome a besoin.",
      items: [
        { title: "Raisonnement multi-étapes", desc: "Il découpe vos objectifs complexes en plans d'action concrets." },
        { title: "Connecteurs natifs", desc: "CRM, e-mail, bases de données, APIs et plus de 200 intégrations." },
        { title: "Mémoire persistante", desc: "Les agents se souviennent du contexte, de vos préférences et de l'historique." },
        { title: "Garde-fous & validation", desc: "Règles métier, points de contrôle humains et journaux d'audit complets." },
        { title: "Exécution parallèle", desc: "Des dizaines d'agents qui travaillent en même temps sur vos files de tâches." },
        { title: "Observabilité", desc: "Des tableaux de bord en temps réel sur chaque décision et chaque action." }
      ]
    },
    flow: {
      eyebrow: "Boucle agentique",
      title: "Percevoir, planifier, agir, apprendre.",
      steps: [
        { n: "Percevoir", desc: "L'agent rassemble le contexte depuis vos outils et vos données." },
        { n: "Planifier", desc: "Il découpe l'objectif en une suite d'actions logique." },
        { n: "Agir", desc: "Il agit dans vos systèmes, avec votre validation si besoin." },
        { n: "Apprendre", desc: "Il évalue le résultat et affine sa méthode pour la fois suivante." }
      ]
    },
    integ: {
      eyebrow: "Écosystème",
      title: "Connecté à toute votre pile technologique.",
      sub: "Vos agents agissent là où vous travaillez déjà."
    },
    dash: { label: "Aperçu du tableau de bord agents" }
  },
  about: {
    hero: {
      eyebrow: "À propos",
      title: "Nous rendons l'automatisation autonome accessible à toutes les équipes.",
      sub: "Votre temps doit servir à ce qui compte vraiment."
    },
    story: {
      eyebrow: "Notre mission",
      title: "Rendre du temps aux équipes.",
      body: "Chaque semaine, des heures s'évaporent dans des tâches répétitives. On conçoit des agents autonomes qui s'en chargent, pour que vos équipes se concentrent sur la stratégie, la création et la relation client."
    },
    values: {
      eyebrow: "Nos valeurs",
      title: "Ce qui guide chacune de nos décisions.",
      items: [
        { title: "Autonomie maîtrisée", desc: "Des agents puissants, qui restent toujours sous votre contrôle et auditables." },
        { title: "Impact d'abord", desc: "On mesure tout en heures gagnées et en valeur créée." },
        { title: "Transparence", desc: "Chaque action d'un agent est traçable et facile à expliquer." },
        { title: "Sur mesure", desc: "Pas de solution générique : des agents pensés pour votre métier." }
      ]
    },
    team: {
      eyebrow: "Le mot du fondateur",
      title: "Une conviction, pas un pitch.",
      members: [
        { name: "Aniss Sebbane", role: "Co-fondateur & CEO" }
      ],
      ceoNote: "On a fondé Agentrix parce qu'on en avait assez de voir des équipes brillantes s'épuiser sur des tâches qu'une machine peut faire mieux. Chaque agent qu'on construit a un seul objectif : vous rendre du temps pour ce qui compte vraiment. C'est une conviction, pas un argument de vente."
    }
  },
  testimonials: {
    hero: {
      eyebrow: "Témoignages",
      title: "Des heures récupérées, des résultats concrets.",
      sub: "Ce que racontent les équipes qui ont déployé des agents Agentrix."
    },
    items: [
      { quote: "Nos relances commerciales tournent toutes seules. On a récupéré près de 20 heures par semaine sur l'équipe vente.", name: "Camille Durand", role: "Directrice commerciale", company: "Northwind" },
      { quote: "Le scraping de leads qualifiés a transformé notre pipeline. Trois fois plus de prospects pertinents, sans le moindre effort manuel.", name: "Thomas Petit", role: "Head of Growth", company: "Lumio" },
      { quote: "En moins d'un mois, notre support de niveau 1 était automatisé. Les clients n'ont rien remarqué, à part des réponses plus rapides.", name: "Aïcha Benali", role: "COO", company: "Helios" },
      { quote: "Le nouveau site conçu par Agentrix convertit deux fois mieux que l'ancien. Et il a été livré en trois semaines.", name: "Marc Lefèvre", role: "Fondateur", company: "Atelier Vert" },
      { quote: "Enfin une équipe qui parle impact plutôt que jargon. On voit chaque heure gagnée sur le tableau de bord.", name: "Nadia Cherif", role: "Operations Lead", company: "Brightpath" },
      { quote: "Leurs agents s'intègrent dans nos outils existants sans la moindre friction. Le déploiement a été d'une simplicité remarquable.", name: "Julien Roy", role: "CTO", company: "Vela" }
    ],
    metric: "des clients renouvellent après le premier trimestre"
  },
  contact: {
    hero: {
      eyebrow: "Contact",
      title: "Parlons-en.",
      sub: "Une question, un projet ? Écrivez-nous, appelez-nous ou passez nous voir."
    },
    form: {
      name: "Nom complet",
      email: "E-mail professionnel",
      company: "Entreprise",
      need: "Votre besoin",
      needOpts: ["Automatiser des workflows", "Scraper des leads qualifiés", "Refondre ou créer un site", "Autre"],
      message: "Décrivez votre projet",
      submit: "Envoyer ma demande",
      sending: "Envoi…",
      sent: "Message envoyé ✓",
      sentSub: "Nous revenons vers vous sous 24 h.",
      again: "Envoyer un autre message"
    },
    info: {
      eyebrow: "Nos coordonnées",
      emailLabel: "E-mail",
      email: "contact@agentrix-ia.com",
      phoneLabel: "Téléphone",
      phone: "+212 661 151 480",
      addressLabel: "Adresse",
      address: "Avenue Hassane Rue Boundoukia\n30050, Fès, Maroc",
      mapLabel: "Notre localisation"
    }
  },
  footer: {
    tagline: "Des agents autonomes qui réfléchissent, s'organisent et passent à l'action, pour vous rendre du temps.",
    product: "Produit",
    company: "Entreprise",
    contact: "Contact",
    rights: "© 2026 Agentrix-IA. Tous droits réservés.",
    cta: "Nous contacter",
    legal: { privacy: "Confidentialité", cookies: "Cookies", terms: "Conditions" }
  },
  legal: {
    privacy: {
      eyebrow: "Confidentialité",
      title: "Politique de confidentialité",
      updated: "Dernière mise à jour : 18 septembre 2026",
      intro: "Agentrix-IA accorde une attention particulière à la protection de vos données personnelles. Cette politique explique quelles données nous collectons, pourquoi, et comment vous pouvez exercer vos droits.",
      sections: [
        { h: "Responsable de traitement", body: "Agentrix-IA, Avenue Hassane Rue Boundoukia, 30050 Fès, Maroc — contact@agentrix-ia.com — est responsable du traitement des données collectées via ce site." },
        { h: "Données que nous collectons", body: "Lorsque vous remplissez notre formulaire de contact : nom, e-mail professionnel, entreprise, nature de votre besoin et message. Nous collectons également des données techniques de navigation (langue choisie, informations de connexion basiques) nécessaires au bon fonctionnement du site — voir notre Politique de cookies pour le détail." },
        { h: "Pourquoi nous les utilisons", body: "Répondre à vos demandes de contact ou de devis, vous fournir et améliorer nos agents IA, assurer la sécurité du site, et respecter nos obligations légales. Nous n'utilisons jamais vos données à des fins de publicité tierce." },
        { h: "Base légale", body: "Le traitement repose sur votre consentement (formulaire de contact), l'exécution de mesures précontractuelles à votre demande, et notre intérêt légitime à assurer la sécurité et le bon fonctionnement du site." },
        { h: "Partage des données", body: "Vos données ne sont jamais vendues. Elles peuvent être transmises à des prestataires techniques strictement nécessaires (hébergement, messagerie) agissant sous nos instructions et dans le respect de la confidentialité." },
        { h: "Durée de conservation", body: "Les données issues d'une demande de contact sont conservées 24 mois maximum en l'absence de relation commerciale, puis supprimées ou anonymisées." },
        { h: "Vos droits", body: "Vous disposez d'un droit d'accès, de rectification, d'effacement, d'opposition et de portabilité sur vos données. Pour les exercer, écrivez-nous à contact@agentrix-ia.com. Vous pouvez également saisir la Commission Nationale de contrôle de la protection des Données à caractère Personnel (CNDP) au Maroc, ou l'autorité de protection des données compétente si vous résidez dans l'Union européenne." },
        { h: "Sécurité", body: "Nous mettons en œuvre des mesures techniques et organisationnelles raisonnables pour protéger vos données contre la perte, l'accès non autorisé ou la divulgation." },
        { h: "Contact", body: "Pour toute question relative à cette politique, contactez-nous à contact@agentrix-ia.com ou au +212 661 151 480." }
      ]
    },
    cookies: {
      eyebrow: "Cookies",
      title: "Politique de cookies",
      updated: "Dernière mise à jour : 18 septembre 2026",
      intro: "Cette page explique ce que sont les cookies, lesquels nous utilisons sur agentrix-ia.com, et comment vous pouvez gérer vos préférences.",
      sections: [
        { h: "Qu'est-ce qu'un cookie ?", body: "Un cookie (ou traceur similaire, comme le stockage local du navigateur) est un petit fichier déposé sur votre appareil lors de votre visite, qui permet de mémoriser des informations d'une visite à l'autre." },
        { h: "Les cookies que nous utilisons", body: "Notre site utilise uniquement des traceurs essentiels : votre langue d'affichage préférée (FR/EN/AR) et votre choix de consentement aux cookies. Aucun cookie publicitaire ou de mesure d'audience n'est déposé à ce jour." },
        { h: "Services tiers", body: "La page Contact intègre une carte OpenStreetMap. Ce service tiers peut déposer ses propres cookies techniques lorsque la carte est affichée, indépendamment de notre site. Nous n'avons pas de contrôle sur ces cookies." },
        { h: "Gérer vos préférences", body: "Vous pouvez accepter ou refuser les cookies non essentiels via le bandeau affiché lors de votre première visite. Vous pouvez également supprimer les cookies et le stockage local à tout moment depuis les réglages de votre navigateur." },
        { h: "Mise à jour de cette politique", body: "Si notre usage des cookies évolue (par exemple l'ajout d'un outil de mesure d'audience), cette page sera mise à jour et, si nécessaire, un nouveau consentement vous sera demandé." }
      ]
    },
    terms: {
      eyebrow: "Conditions",
      title: "Conditions d'utilisation",
      updated: "Dernière mise à jour : 18 septembre 2026",
      intro: "Ces conditions régissent l'utilisation du site agentrix-ia.com. En y naviguant, vous acceptez les termes ci-dessous.",
      sections: [
        { h: "Objet", body: "Ce site présente Agentrix-IA, agence spécialisée dans la conception d'agents IA agentiques, l'automatisation de workflows et la création de sites web, ainsi que ses coordonnées et son offre." },
        { h: "Propriété intellectuelle", body: "L'ensemble des contenus du site (textes, visuels, logo, code) est la propriété d'Agentrix-IA ou de ses partenaires, sauf mention contraire, et ne peut être reproduit sans autorisation écrite préalable." },
        { h: "Utilisation du site", body: "Vous vous engagez à utiliser ce site de manière conforme à la loi et à ne pas tenter d'en extraire le contenu, d'en perturber le fonctionnement ou d'en abuser (scraping massif, attaque, usurpation)." },
        { h: "Nos services", body: "Les présentes conditions concernent uniquement la navigation sur ce site vitrine. Toute prestation (déploiement d'agents, automatisation, développement web) fait l'objet d'un devis et d'un contrat distinct entre Agentrix-IA et le client." },
        { h: "Disponibilité et responsabilité", body: "Nous mettons tout en œuvre pour assurer la disponibilité du site mais ne garantissons pas un accès ininterrompu. Le site peut contenir des liens vers des sites tiers dont nous ne maîtrisons pas le contenu." },
        { h: "Droit applicable", body: "Les présentes conditions sont soumises au droit marocain. Tout litige relève de la compétence des juridictions de Fès, Maroc, sauf disposition légale impérative contraire." },
        { h: "Contact", body: "Pour toute question relative à ces conditions, écrivez-nous à contact@agentrix-ia.com." }
      ]
    }
  },
  cookieBanner: {
    title: "Nous utilisons des cookies essentiels",
    text: "Uniquement pour mémoriser votre langue et votre choix ci-dessous — aucun traceur publicitaire.",
    accept: "Accepter",
    decline: "Refuser",
    link: "En savoir plus"
  },
  socialProof: {
    lead: "Une demande de",
    verb: "pour",
    now: "À l'instant",
    items: [
      { city: "Casablanca", activity: "un site web moderne" },
      { city: "Paris", activity: "l'automatisation de ses workflows" },
      { city: "Abidjan", activity: "un agent IA pour le service client" },
      { city: "Dakar", activity: "un devis pour des agents IA" },
      { city: "Montréal", activity: "une démonstration de nos agents" },
      { city: "Douala", activity: "la génération de leads qualifiés" },
      { city: "Kigali", activity: "une refonte de son site web" },
      { city: "Marrakech", activity: "l'intégration de ses outils (CRM, Slack, Gmail)" },
      { city: "Lyon", activity: "un agent IA de facturation" },
      { city: "Yaoundé", activity: "l'automatisation de sa prospection" },
      { city: "Rabat", activity: "un audit de ses processus" },
      { city: "Québec", activity: "un agent IA pour son support client" },
      { city: "Dakar", activity: "la création d'un site vitrine" },
      { city: "Bouaké", activity: "l'automatisation de sa facturation" },
      { city: "Tanger", activity: "un agent IA de veille concurrentielle" },
      { city: "Marseille", activity: "l'automatisation de ses e-mails" },
      { city: "Kigali", activity: "un accompagnement en agents IA" },
      { city: "Fès", activity: "un agent IA pour la prospection" },
      { city: "Bordeaux", activity: "un devis pour un site e-commerce" },
      { city: "Toronto", activity: "l'intégration d'un agent IA à son CRM" }
    ]
  }
};

window.I18N_EN = {
  nav: {
    home: "Home",
    product: "Product",
    about: "About",
    blog: "Blog",
    testimonials: "Testimonials",
    contact: "Contact",
    cta: "Get in touch"
  },
  common: {
    getStarted: "Get started",
    talkToUs: "Talk to an expert",
    learnMore: "Learn more",
    explore: "Explore",
    perWeek: "per week",
    backHome: "Back to home"
  },
  home: {
    hero: {
      badge: "Agentic AI agency",
      titleA: "Autonomous agents that",
      titleHi: "work in your place.",
      sub: "We design and deploy AI agents that reason, plan and execute complex tasks, so you reclaim hours every single week.",
      cta1: "Get in touch",
      cta2: "See the product",
      s1: "hrs reclaimed / week",
      s2: "agents deployed",
      s3: "of tasks automated"
    },
    logos: { label: "Teams automating with Agentrix" },
    pillars: {
      eyebrow: "What our agents do",
      title: "A digital teammate for every repetitive workflow.",
      sub: "Four agent families, deployed bespoke and wired into your tools.",
      included: "What's included",
      items: [
        { tag: "01 · Automation", title: "Workflow automation",
          desc: "Your repetitive processes run end-to-end, 24/7, with no supervision.",
          long: "Follow-ups, data entry, reports, syncing: your repetitive tasks run end-to-end, handled by agents that work continuously and never lose the thread.",
          points: ["Automatic follow-ups & nudges", "Sync across your tools", "Reports generated hands-free", "Custom triggers & rules"],
          metric: { value: "≈16h", label: "reclaimed / week" } },
        { tag: "02 · Acquisition", title: "Scraping & qualified leads",
          desc: "Identify, enrich and qualify prospects at scale, automatically.",
          long: "Agents that identify, enrich and qualify your prospects continuously, feeding your pipeline with genuinely relevant contacts.",
          points: ["Targeted prospect detection", "Contact data enrichment", "Qualification on your criteria", "Direct export to your CRM"],
          metric: { value: "3.4×", label: "more qualified leads" } },
        { tag: "03 · Web", title: "High-conversion websites",
          desc: "Modern, fast, optimized sites engineered to convert.",
          long: "Modern, fast websites optimized for SEO and conversion. Our team designs, builds and delivers them turnkey.",
          points: ["Bespoke responsive design", "Performance & SEO optimized", "Journeys built to convert", "Delivered in a few weeks"],
          metric: { value: "×2", label: "conversion rate" } },
        { tag: "04 · Decision", title: "Reasoning agents",
          desc: "Agents that plan, decide and adapt to your business rules.",
          long: "Agents that break down an objective, plan the steps, decide and adapt to your business rules. A human stays in the loop whenever needed.",
          points: ["Break down complex objectives", "Autonomous planning & execution", "Adapts to business rules", "Optional human approval"],
          metric: { value: "24/7", label: "availability" } }
      ]
    },
    how: {
      eyebrow: "How it works",
      title: "From audit to deployment in three steps.",
      steps: [
        { n: "01", title: "Audit & mapping", desc: "We analyze your workflows and find the hours lost on repetitive tasks." },
        { n: "02", title: "Agent design", desc: "We build bespoke agents, wired into your tools and your data." },
        { n: "03", title: "Deploy & operate", desc: "Production rollout, monitoring and continuous performance tuning." }
      ]
    },
    metrics: {
      eyebrow: "Measurable impact",
      title: "The time you reclaim, quantified.",
      items: [
        { value: "≈16h", label: "reclaimed per week, per team" },
        { value: "90%", label: "of repetitive tasks automated" },
        { value: "3.4×", label: "more qualified leads" },
        { value: "< 4 wks", label: "from first call to production" }
      ]
    },
    cta: {
      title: "What if your repetitive tasks ran themselves?",
      sub: "Request a free 30-minute diagnostic. We'll identify your first three high-impact agents.",
      btn: "Request my diagnostic"
    },
    tmoni: {
      eyebrow: "Trusted by teams",
      title: "Lighter teams, concrete results.",
      sub: "What clients say after deploying our agents.",
      photo: "client photo"
    },
    faq: {
      eyebrow: "Frequently asked",
      title: "Everything about our agentic services.",
      sub: "Answers to the questions we hear most often.",
      items: [
        { q: "What is an autonomous AI agent?", a: "A smart program that perceives its environment, plans steps and executes complex tasks inside your tools, without constant supervision. A real digital teammate, basically." },
        { q: "What kinds of tasks can you automate?", a: "Sales follow-ups, lead qualification, data entry, reports, tier-1 support, tool-to-tool syncing… any repetitive, time-consuming task." },
        { q: "Do we need technical skills?", a: "No. We design, deploy and operate the agents for you. You stay in control through a simple, clear dashboard." },
        { q: "How do you measure results?", a: "In hours saved and value created. Every agent action is traceable, and you track impact in real time on your dashboard." },
        { q: "What if our needs change?", a: "Agents adapt. We offer continuous optimization and you can add, change or stop an agent at any time." }
      ]
    },
    lead: {
      eyebrow: "Let's start",
      title: "Tell us about your project.",
      sub: "Leave your details: an expert gets back to you within 24h with your first high-impact agents.",
      fName: "Last name",
      fFirst: "First name",
      fEmail: "Email",
      fProject: "Your project",
      fProjectPh: "In a few words, what would you like to automate…",
      optional: "(optional)",
      required: "Required field",
      emailInvalid: "Invalid email address",
      submit: "Get a callback",
      sending: "Sending…",
      success: "Thanks, got it ✓",
      successSub: "Our team will get back to you within 24h.",
      again: "Send another request"
    },
    chat: {
      launcher: "Have a question?",
      title: "Agentrix Agent",
      status: "Online · replies in seconds",
      welcome: "Hi 👋 I'm the Agentrix agent. Ask me anything about our agentic services, or pick a question below.",
      intro: "Suggestions",
      more: "More questions",
      inputPlaceholder: "Type your message…",
      typing: "Agent is typing…",
      fallback: "Great question! For a precise, tailored answer, it's best to talk it through. Leave your details right here 👇",
      leadIntro: "Perfect! Leave your details and our team will get back to you within 24h.",
      restart: "Start over",
      items: [
        { q: "What exactly do you do?", a: "We design and deploy autonomous AI agents that automate your repetitive workflows, scrape qualified leads and build high-conversion websites, so you save hours every week." },
        { q: "How long to deploy an agent?", a: "Usually under 4 weeks from the first call to production, depending on your workflow's complexity." },
        { q: "What tools can you integrate?", a: "CRM, email, databases, Slack, Notion, Stripe… 200+ integrations. Your agents act right where you already work." },
        { q: "Is my data safe?", a: "Yes: end-to-end encryption, European hosting, and on-premise deployment for sensitive needs." },
        { q: "How much does it cost?", a: "It depends on what you want to automate. The best next step is a free diagnostic: we scope it together and give you a clear budget, with no lock-in." }
      ],
      leadQ: "I'd like a callback",
      secEyebrow: "Live assistant",
      secTitle: "Chat with our AI agent.",
      secSub: "Ask a question, or click one of the suggestions below."
    }
  },
  product: {
    hero: {
      eyebrow: "The product",
      title: "An agent platform that reasons, plans and executes.",
      sub: "Every Agentrix agent perceives its environment, breaks an objective into steps, acts inside your tools and learns from every run."
    },
    capabilities: {
      eyebrow: "Capabilities",
      title: "Everything an autonomous agent needs.",
      items: [
        { title: "Multi-step reasoning", desc: "Breaks complex objectives into executable action plans." },
        { title: "Native connectors", desc: "CRM, email, databases, APIs and 200+ integrations." },
        { title: "Persistent memory", desc: "Agents remember context, preferences and history." },
        { title: "Guardrails & approval", desc: "Business rules, human checkpoints and full audit logs." },
        { title: "Parallel execution", desc: "Dozens of agents working at once across your task queues." },
        { title: "Observability", desc: "Real-time dashboards on every decision and action." }
      ]
    },
    flow: {
      eyebrow: "Agentic loop",
      title: "Perceive, plan, act, learn.",
      steps: [
        { n: "Perceive", desc: "The agent gathers context from your tools and data." },
        { n: "Plan", desc: "It breaks the objective into an optimal sequence of actions." },
        { n: "Act", desc: "It executes inside your systems, with approval where needed." },
        { n: "Learn", desc: "It evaluates the outcome and refines its strategy." }
      ]
    },
    integ: {
      eyebrow: "Ecosystem",
      title: "Connected to your whole stack.",
      sub: "Your agents act right where you already work."
    },
    dash: { label: "Agent dashboard preview" }
  },
  about: {
    hero: {
      eyebrow: "About",
      title: "We make autonomous automation accessible to every team.",
      sub: "Your time should go to what truly matters."
    },
    story: {
      eyebrow: "Our mission",
      title: "Give teams their time back.",
      body: "Every week, hours vanish into repetitive tasks. We build autonomous agents that absorb them, so your teams can focus on strategy, creativity and customer relationships."
    },
    values: {
      eyebrow: "Our values",
      title: "What guides every decision we make.",
      items: [
        { title: "Controlled autonomy", desc: "Powerful agents, always under your control and auditable." },
        { title: "Impact first", desc: "We measure everything in hours saved and value created." },
        { title: "Transparency", desc: "Every agent action is traceable and explainable." },
        { title: "Bespoke", desc: "No generic solution, just agents built for your business." }
      ]
    },
    team: {
      eyebrow: "Founder's note",
      title: "A conviction, not a pitch.",
      members: [
        { name: "Aniss Sebbane", role: "Co-founder & CEO" }
      ],
      ceoNote: "We started Agentrix because we were tired of watching brilliant teams burn out on work a machine could do better. Every agent we build has one goal: give you back time for what actually matters. That's a conviction, not a pitch."
    }
  },
  testimonials: {
    hero: {
      eyebrow: "Testimonials",
      title: "Hours reclaimed, real results.",
      sub: "What teams say after deploying Agentrix agents."
    },
    items: [
      { quote: "Our sales follow-ups run themselves. We reclaimed nearly 20 hours a week across the sales team.", name: "Camille Durand", role: "Head of Sales", company: "Northwind" },
      { quote: "Qualified lead scraping transformed our pipeline. Three times more relevant prospects, with zero manual effort.", name: "Thomas Petit", role: "Head of Growth", company: "Lumio" },
      { quote: "In under a month, our tier-1 support was automated. Customers noticed nothing, except faster answers.", name: "Aïcha Benali", role: "COO", company: "Helios" },
      { quote: "The new site Agentrix built converts twice as well as the old one. And it shipped in three weeks.", name: "Marc Lefèvre", role: "Founder", company: "Atelier Vert" },
      { quote: "Finally a team that talks impact, not jargon. We see every hour saved on the dashboard.", name: "Nadia Cherif", role: "Operations Lead", company: "Brightpath" },
      { quote: "Their agents slot into our existing tools without friction. Deployment was remarkably simple.", name: "Julien Roy", role: "CTO", company: "Vela" }
    ],
    metric: "of clients renew after the first quarter"
  },
  contact: {
    hero: {
      eyebrow: "Contact",
      title: "Let's talk.",
      sub: "A question or a project? Email us, call us, or stop by."
    },
    form: {
      name: "Full name",
      email: "Work email",
      company: "Company",
      need: "Your need",
      needOpts: ["Automate workflows", "Scrape qualified leads", "Rebuild / create a website", "Other"],
      message: "Describe your project",
      submit: "Send my request",
      sending: "Sending…",
      sent: "Message sent ✓",
      sentSub: "We'll get back to you within 24h.",
      again: "Send another message"
    },
    info: {
      eyebrow: "Our details",
      emailLabel: "Email",
      email: "contact@agentrix-ia.com",
      phoneLabel: "Phone",
      phone: "+212 661 151 480",
      addressLabel: "Address",
      address: "Avenue Hassane Rue Boundoukia\n30050, Fès, Morocco",
      mapLabel: "Our location"
    }
  },
  footer: {
    tagline: "Autonomous agents that reason, plan and execute, to give you your time back.",
    product: "Product",
    company: "Company",
    contact: "Contact",
    rights: "© 2026 Agentrix-IA. All rights reserved.",
    cta: "Get in touch",
    legal: { privacy: "Privacy", cookies: "Cookies", terms: "Terms" }
  },
  legal: {
    privacy: {
      eyebrow: "Privacy",
      title: "Privacy Policy",
      updated: "Last updated: September 18, 2026",
      intro: "Agentrix-IA takes the protection of your personal data seriously. This policy explains what data we collect, why, and how you can exercise your rights.",
      sections: [
        { h: "Data controller", body: "Agentrix-IA, Avenue Hassane Rue Boundoukia, 30050 Fès, Morocco — contact@agentrix-ia.com — is the data controller for the data collected through this site." },
        { h: "Data we collect", body: "When you fill in our contact form: your name, professional email, company, the nature of your need, and your message. We also collect basic technical browsing data (your chosen language, basic connection information) needed to run the site — see our Cookie Policy for details." },
        { h: "Why we use it", body: "To respond to your contact or quote requests, to deliver and improve our AI agents, to keep the site secure, and to meet our legal obligations. We never use your data for third-party advertising." },
        { h: "Legal basis", body: "Processing relies on your consent (contact form), pre-contractual steps taken at your request, and our legitimate interest in keeping the site secure and functional." },
        { h: "Data sharing", body: "Your data is never sold. It may be shared with technical service providers strictly required for our operations (hosting, email), acting on our instructions and bound by confidentiality." },
        { h: "Retention period", body: "Data from a contact request is kept for a maximum of 24 months in the absence of a business relationship, then deleted or anonymized." },
        { h: "Your rights", body: "You have the right to access, correct, erase, object to, and port your data. To exercise these rights, write to contact@agentrix-ia.com. You may also contact Morocco's National Commission for the Control of Personal Data Protection (CNDP), or your competent data protection authority if you are based in the European Union." },
        { h: "Security", body: "We apply reasonable technical and organizational measures to protect your data against loss, unauthorized access, or disclosure." },
        { h: "Contact", body: "For any question about this policy, reach us at contact@agentrix-ia.com or +212 661 151 480." }
      ]
    },
    cookies: {
      eyebrow: "Cookies",
      title: "Cookie Policy",
      updated: "Last updated: September 18, 2026",
      intro: "This page explains what cookies are, which ones we use on agentrix-ia.com, and how you can manage your preferences.",
      sections: [
        { h: "What is a cookie?", body: "A cookie (or similar tracker, such as browser local storage) is a small file placed on your device during your visit, used to remember information between visits." },
        { h: "The cookies we use", body: "Our site only uses essential trackers: your preferred display language (FR/EN/AR) and your cookie consent choice. No advertising or audience-measurement cookie is set at this time." },
        { h: "Third-party services", body: "The Contact page embeds an OpenStreetMap map. This third-party service may set its own technical cookies when the map is displayed, independently of our site. We have no control over these cookies." },
        { h: "Managing your preferences", body: "You can accept or decline non-essential cookies via the banner shown on your first visit. You can also delete cookies and local storage at any time from your browser settings." },
        { h: "Updates to this policy", body: "If our use of cookies changes (for example, adding an audience-measurement tool), this page will be updated and, if needed, your consent will be requested again." }
      ]
    },
    terms: {
      eyebrow: "Terms",
      title: "Terms of Use",
      updated: "Last updated: September 18, 2026",
      intro: "These terms govern the use of agentrix-ia.com. By browsing this site, you accept the terms below.",
      sections: [
        { h: "Purpose", body: "This site presents Agentrix-IA, an agency specializing in agentic AI agents, workflow automation, and website creation, along with its contact details and offering." },
        { h: "Intellectual property", body: "All content on this site (text, visuals, logo, code) is the property of Agentrix-IA or its partners, unless stated otherwise, and may not be reproduced without prior written permission." },
        { h: "Use of the site", body: "You agree to use this site lawfully and not to attempt to extract its content, disrupt its operation, or misuse it (mass scraping, attacks, impersonation)." },
        { h: "Our services", body: "These terms only cover browsing this showcase site. Any service engagement (agent deployment, automation, web development) is subject to a separate quote and contract between Agentrix-IA and the client." },
        { h: "Availability and liability", body: "We do our best to keep the site available but do not guarantee uninterrupted access. The site may contain links to third-party sites whose content we do not control." },
        { h: "Governing law", body: "These terms are governed by Moroccan law. Any dispute falls under the jurisdiction of the courts of Fès, Morocco, unless mandatory law provides otherwise." },
        { h: "Contact", body: "For any question about these terms, write to contact@agentrix-ia.com." }
      ]
    }
  },
  cookieBanner: {
    title: "We use essential cookies",
    text: "Only to remember your language and your choice below — no advertising trackers.",
    accept: "Accept",
    decline: "Decline",
    link: "Learn more"
  },
  socialProof: {
    lead: "A request from",
    verb: "for",
    now: "Just now",
    items: [
      { city: "Casablanca", activity: "a modern website" },
      { city: "Paris", activity: "workflow automation" },
      { city: "Abidjan", activity: "an AI customer service agent" },
      { city: "Dakar", activity: "a quote for AI agents" },
      { city: "Montreal", activity: "a demo of our agents" },
      { city: "Douala", activity: "qualified lead generation" },
      { city: "Kigali", activity: "a website redesign" },
      { city: "Marrakech", activity: "tool integrations (CRM, Slack, Gmail)" },
      { city: "Lyon", activity: "an AI billing agent" },
      { city: "Yaoundé", activity: "prospecting automation" },
      { city: "Rabat", activity: "a process audit" },
      { city: "Quebec City", activity: "an AI customer support agent" },
      { city: "Dakar", activity: "a showcase website" },
      { city: "Bouaké", activity: "billing automation" },
      { city: "Tangier", activity: "a competitive-watch AI agent" },
      { city: "Marseille", activity: "email automation" },
      { city: "Kigali", activity: "AI agent support" },
      { city: "Fès", activity: "an AI prospecting agent" },
      { city: "Bordeaux", activity: "a quote for an e-commerce site" },
      { city: "Toronto", activity: "an AI agent integrated with their CRM" }
    ]
  }
};

window.I18N_AR = {
  nav: {
    home: "الرئيسية",
    product: "المنتج",
    about: "من نحن",
    blog: "المدونة",
    testimonials: "آراء العملاء",
    contact: "تواصل معنا",
    cta: "اتصل بنا"
  },
  common: {
    getStarted: "ابدأ الآن",
    talkToUs: "تحدّث مع خبير",
    learnMore: "اعرف المزيد",
    explore: "استكشف",
    perWeek: "أسبوعياً",
    backHome: "العودة إلى الرئيسية"
  },
  home: {
    hero: {
      badge: "وكالة ذكاء اصطناعي وكيل",
      titleA: "وكلاء مستقلون",
      titleHi: "يعملون نيابةً عنك.",
      sub: "نصمّم ونطلق وكلاء ذكاء اصطناعي قادرين على التفكير والتخطيط وتنفيذ المهام المعقّدة، لتوفّر ساعات من وقتك كل أسبوع.",
      cta1: "اتصل بنا",
      cta2: "شاهد المنتج",
      s1: "ساعة موفّرة / أسبوع",
      s2: "وكيل تم إطلاقه",
      s3: "من المهام مؤتمتة"
    },
    logos: { label: "فرق تعمل بالأتمتة مع Agentrix" },
    pillars: {
      eyebrow: "ماذا يفعل وكلاؤنا",
      title: "زميل رقمي لكل سير عمل متكرر.",
      sub: "أربع عائلات من الوكلاء، تُطلق حسب الطلب وتتصل بأدواتك.",
      included: "ما الذي يشمله",
      items: [
        { tag: "٠١ · الأتمتة", title: "أتمتة سير العمل",
          desc: "تنفيذ عملياتك المتكررة من البداية للنهاية، على مدار الساعة، دون إشراف.",
          long: "المتابعات وإدخال البيانات والتقارير والمزامنة: تُنفَّذ مهامك المتكررة من البداية للنهاية بواسطة وكلاء يعملون باستمرار دون أن يفقدوا الخيط أبداً.",
          points: ["متابعات وتذكيرات تلقائية", "مزامنة بين أدواتك", "تقارير تُولَّد دون تدخل", "محفّزات وقواعد حسب الطلب"],
          metric: { value: "≈16ساعة", label: "موفّرة / أسبوع" } },
        { tag: "٠٢ · الاستقطاب", title: "جمع وتأهيل العملاء المحتملين",
          desc: "تحديد وإثراء وتأهيل العملاء المحتملين على نطاق واسع وبشكل آلي.",
          long: "وكلاء يحدّدون ويُثرون ويؤهّلون عملاءك المحتملين باستمرار، لتغذية مسار مبيعاتك بجهات اتصال وثيقة الصلة فعلاً.",
          points: ["كشف العملاء المستهدفين", "إثراء بيانات الاتصال", "تأهيل وفق معاييرك", "تصدير مباشر إلى نظام CRM"],
          metric: { value: "٣٫٤×", label: "عملاء مؤهّلون أكثر" } },
        { tag: "٠٣ · الويب", title: "مواقع عالية التحويل",
          desc: "مواقع عصرية وسريعة ومحسّنة، مصمّمة لتحقيق التحويل.",
          long: "مواقع عصرية وسريعة ومحسّنة لمحركات البحث والتحويل. نصمّمها ونطوّرها ونسلّمها جاهزة بالكامل.",
          points: ["تصميم مخصّص ومتجاوب", "أداء وتحسين محركات بحث", "مسارات مصمّمة للتحويل", "تسليم خلال أسابيع"],
          metric: { value: "×٢", label: "معدّل التحويل" } },
        { tag: "٠٤ · القرار", title: "وكلاء التفكير",
          desc: "وكلاء يخطّطون ويقرّرون ويتكيّفون مع قواعد عملك.",
          long: "وكلاء قادرون على تفكيك الهدف وتخطيط الخطوات واتخاذ القرار والتكيّف مع قواعد عملك. ويبقى إنسان في الحلقة عند الحاجة.",
          points: ["تفكيك الأهداف المعقّدة", "تخطيط وتنفيذ مستقلان", "تكيّف مع قواعد العمل", "موافقة بشرية اختيارية"],
          metric: { value: "٢٤/٧", label: "جاهزية دائمة" } }
      ]
    },
    how: {
      eyebrow: "كيف يعمل",
      title: "من التدقيق إلى الإطلاق في ثلاث خطوات.",
      steps: [
        { n: "٠١", title: "التدقيق ورسم الخريطة", desc: "نحلّل سير عملك ونكتشف الساعات الضائعة في المهام المتكررة." },
        { n: "٠٢", title: "تصميم الوكلاء", desc: "نبني وكلاء حسب الطلب، متصلين بأدواتك وبياناتك." },
        { n: "٠٣", title: "الإطلاق والتشغيل", desc: "النشر في الإنتاج والمراقبة والتحسين المستمر للأداء." }
      ]
    },
    metrics: {
      eyebrow: "أثر قابل للقياس",
      title: "الوقت الذي تستعيده، بالأرقام.",
      items: [
        { value: "≈16ساعة", label: "موفّرة أسبوعياً لكل فريق" },
        { value: "90٪", label: "من المهام المتكررة مؤتمتة" },
        { value: "٣٫٤×", label: "عملاء محتملون مؤهّلون أكثر" },
        { value: "< ٤ أسابيع", label: "من أول مكالمة إلى الإنتاج" }
      ]
    },
    cta: {
      title: "ماذا لو نُفِّذت مهامك المتكررة من تلقاء نفسها؟",
      sub: "اطلب تشخيصاً مجانياً لمدة ٣٠ دقيقة. سنحدّد أول ثلاثة وكلاء عالي الأثر.",
      btn: "اطلب تشخيصي"
    },
    tmoni: {
      eyebrow: "يثقون بنا",
      title: "فرق أخفّ عبئاً ونتائج ملموسة.",
      sub: "ما يقوله العملاء بعد إطلاق وكلائنا.",
      photo: "صورة عميل"
    },
    faq: {
      eyebrow: "أسئلة شائعة",
      title: "كل ما تريد معرفته عن خدماتنا الوكيلة.",
      sub: "إجابات عن الأسئلة الأكثر تكراراً.",
      items: [
        { q: "ما هو الوكيل الذكي المستقل؟", a: "هو برنامج ذكي يدرك بيئته، ويخطّط الخطوات، وينفّذ مهام معقّدة داخل أدواتك دون إشراف دائم، كزميل رقمي حقيقي." },
        { q: "ما أنواع المهام التي يمكنكم أتمتتها؟", a: "متابعات المبيعات، تأهيل العملاء، إدخال البيانات، التقارير، الدعم من المستوى الأول، المزامنة بين الأدوات… أي مهمة متكررة ومستهلكة للوقت." },
        { q: "هل نحتاج مهارات تقنية؟", a: "لا. نحن نصمّم وننشر ونشغّل الوكلاء نيابةً عنك. تبقى متحكّماً عبر لوحة تحكّم بسيطة وواضحة." },
        { q: "كيف تقيسون النتائج؟", a: "بالساعات الموفّرة والقيمة المُنشأة. كل إجراء للوكيل قابل للتتبّع، وتتابع الأثر لحظياً على لوحة تحكّمك." },
        { q: "وماذا لو تغيّرت احتياجاتنا؟", a: "يتكيّف الوكلاء. نقدّم تحسيناً مستمراً، ويمكنك إضافة أو تعديل أو إيقاف أي وكيل في أي وقت." }
      ]
    },
    lead: {
      eyebrow: "لنبدأ",
      title: "حدّثنا عن مشروعك.",
      sub: "اترك بياناتك: سيعاود خبير التواصل معك خلال ٢٤ ساعة مع أول وكلائك عالي الأثر.",
      fName: "الاسم",
      fFirst: "الاسم الأول",
      fEmail: "البريد الإلكتروني",
      fProject: "مشروعك",
      fProjectPh: "بكلمات قليلة، ما الذي تودّ أتمتته…",
      optional: "(اختياري)",
      required: "حقل مطلوب",
      emailInvalid: "بريد إلكتروني غير صالح",
      submit: "أريد أن يُعاد الاتصال بي",
      sending: "جارٍ الإرسال…",
      success: "شكراً، تم التسجيل ✓",
      successSub: "سيعاود فريقنا التواصل معك خلال ٢٤ ساعة.",
      again: "إرسال طلب آخر"
    },
    chat: {
      launcher: "لديك سؤال؟",
      title: "وكيل Agentrix",
      status: "متصل · يردّ خلال ثوانٍ",
      welcome: "مرحباً 👋 أنا وكيل Agentrix. اسألني أي شيء عن خدماتنا الوكيلة، أو اختر سؤالاً بالأسفل.",
      intro: "اقتراحات",
      more: "أسئلة أخرى",
      inputPlaceholder: "اكتب رسالتك…",
      typing: "الوكيل يكتب…",
      fallback: "سؤال ممتاز! للحصول على إجابة دقيقة ومخصّصة، من الأفضل التحدّث مباشرةً. اترك بياناتك هنا 👇",
      leadIntro: "ممتاز! اترك بياناتك وسيعاود فريقنا التواصل معك خلال ٢٤ ساعة.",
      restart: "إعادة البدء",
      items: [
        { q: "ماذا تفعلون بالضبط؟", a: "نصمّم ونطلق وكلاء ذكاء اصطناعي مستقلين يؤتمتون سير عملك المتكرر، ويجمعون عملاء مؤهّلين، ويبنون مواقع عالية التحويل، لتوفّر ساعات من وقتك كل أسبوع." },
        { q: "كم يستغرق إطلاق وكيل؟", a: "عادةً أقل من ٤ أسابيع من أول مكالمة إلى الإنتاج، حسب تعقيد سير عملك." },
        { q: "ما الأدوات التي يمكنكم دمجها؟", a: "إدارة علاقات العملاء، البريد، قواعد البيانات، Slack، Notion، Stripe… أكثر من ٢٠٠ تكامل. يعمل وكلاؤك حيث تعمل أنت بالفعل." },
        { q: "هل بياناتي آمنة؟", a: "نعم: تشفير من طرف إلى طرف، واستضافة أوروبية، وإمكانية نشر داخلي للاحتياجات الحسّاسة." },
        { q: "كم تبلغ التكلفة؟", a: "يعتمد على ما ترغب في أتمتته. أفضل خطوة تالية هي تشخيص مجاني: نحدّد النطاق معاً ونعطيك ميزانية واضحة، دون التزام." }
      ],
      leadQ: "أريد أن يُعاد الاتصال بي",
      secEyebrow: "مساعد مباشر",
      secTitle: "تحدّث مع وكيلنا الذكي.",
      secSub: "اطرح سؤالاً، أو انقر على أحد الاقتراحات بالأسفل."
    }
  },
  product: {
    hero: {
      eyebrow: "المنتج",
      title: "منصّة وكلاء تفكّر وتخطّط وتنفّذ.",
      sub: "كل وكيل من Agentrix يدرك بيئته، ويقسّم الهدف إلى خطوات، ويعمل داخل أدواتك، ويتعلّم من كل عملية تنفيذ."
    },
    capabilities: {
      eyebrow: "القدرات",
      title: "كل ما يحتاجه وكيل مستقل.",
      items: [
        { title: "تفكير متعدد الخطوات", desc: "تقسيم الأهداف المعقّدة إلى خطط عمل قابلة للتنفيذ." },
        { title: "موصّلات أصلية", desc: "إدارة علاقات العملاء، البريد، قواعد البيانات، وأكثر من ٢٠٠ تكامل." },
        { title: "ذاكرة دائمة", desc: "يتذكّر الوكلاء السياق والتفضيلات والسجل." },
        { title: "ضوابط وموافقات", desc: "قواعد عمل، نقاط مراجعة بشرية، وسجلات تدقيق كاملة." },
        { title: "تنفيذ متوازٍ", desc: "عشرات الوكلاء يعملون في آنٍ واحد عبر مهامك." },
        { title: "قابلية المراقبة", desc: "لوحات تحكّم لحظية لكل قرار وكل إجراء." }
      ]
    },
    flow: {
      eyebrow: "الحلقة الوكيلة",
      title: "يدرك، يخطّط، ينفّذ، يتعلّم.",
      steps: [
        { n: "يدرك", desc: "يجمع الوكيل السياق من أدواتك وبياناتك." },
        { n: "يخطّط", desc: "يقسّم الهدف إلى سلسلة مثلى من الإجراءات." },
        { n: "ينفّذ", desc: "ينفّذ داخل أنظمتك، مع الموافقة عند الحاجة." },
        { n: "يتعلّم", desc: "يقيّم النتيجة ويحسّن استراتيجيته." }
      ]
    },
    integ: {
      eyebrow: "المنظومة",
      title: "متصل بكامل منظومتك التقنية.",
      sub: "يعمل وكلاؤك حيث تعمل أنت بالفعل."
    },
    dash: { label: "معاينة لوحة تحكّم الوكلاء" }
  },
  about: {
    hero: {
      eyebrow: "من نحن",
      title: "نجعل الأتمتة المستقلة في متناول كل فريق.",
      sub: "وقتك يجب أن يُكرَّس لما يهمّ حقاً."
    },
    story: {
      eyebrow: "مهمّتنا",
      title: "إعادة الوقت إلى الفرق.",
      body: "كل أسبوع، تتبخّر ساعات في مهام متكررة. نبني وكلاء مستقلين يستوعبونها، ليتفرّغ فريقك للاستراتيجية والإبداع وعلاقات العملاء."
    },
    values: {
      eyebrow: "قيمنا",
      title: "ما يوجّه كل قرار نتّخذه.",
      items: [
        { title: "استقلالية محكومة", desc: "وكلاء أقوياء، دائماً تحت سيطرتك وقابلون للتدقيق." },
        { title: "الأثر أولاً", desc: "نقيس كل شيء بالساعات الموفّرة والقيمة المُنشأة." },
        { title: "الشفافية", desc: "كل إجراء يقوم به الوكيل قابل للتتبّع والتفسير." },
        { title: "حسب الطلب", desc: "لا حلول عامة، بل وكلاء مصمّمون لعملك." }
      ]
    },
    team: {
      eyebrow: "كلمة المؤسّس",
      title: "قناعة، لا شعار تسويقي.",
      members: [
        { name: "أنيس الصبان", role: "شريك مؤسّس ومدير تنفيذي" }
      ],
      ceoNote: "أسسنا Agentrix لأننا مللنا من رؤية فرق موهوبة تنهك في مهام يمكن لآلة أن تؤديها بشكل أفضل. كل وكيل نبنيه له هدف واحد: إعادة وقتك لما يهمّ فعلاً. هذه قناعة، لا شعار تسويقي."
    }
  },
  testimonials: {
    hero: {
      eyebrow: "آراء العملاء",
      title: "ساعات مستعادة ونتائج ملموسة.",
      sub: "ما تقوله الفرق بعد إطلاق وكلاء Agentrix."
    },
    items: [
      { quote: "أصبحت متابعات المبيعات تعمل من تلقاء نفسها. وفّرنا نحو ٢٠ ساعة أسبوعياً على فريق المبيعات.", name: "كاميل دوران", role: "مديرة المبيعات", company: "Northwind" },
      { quote: "حوّل جمع العملاء المؤهّلين مسار مبيعاتنا. ثلاثة أضعاف العملاء المناسبين، دون أي جهد يدوي.", name: "توماس بوتي", role: "مدير النمو", company: "Lumio" },
      { quote: "في أقل من شهر، أصبح دعمنا من المستوى الأول مؤتمتاً. لم يلاحظ العملاء شيئاً سوى ردود أسرع.", name: "عائشة بنعلي", role: "مديرة العمليات", company: "Helios" },
      { quote: "الموقع الجديد الذي بنته Agentrix يحقّق تحويلاً ضعف القديم. وتم تسليمه في ثلاثة أسابيع.", name: "مارك لوفيفر", role: "مؤسّس", company: "Atelier Vert" },
      { quote: "أخيراً فريق يتحدّث عن الأثر لا عن المصطلحات. نرى كل ساعة موفّرة على لوحة التحكّم.", name: "نادية شريف", role: "مديرة العمليات", company: "Brightpath" },
      { quote: "يندمج وكلاؤهم مع أدواتنا الحالية دون احتكاك. كان الإطلاق بسيطاً بشكل لافت.", name: "جوليان روا", role: "المدير التقني", company: "Vela" }
    ],
    metric: "من العملاء يجدّدون بعد الربع الأول"
  },
  contact: {
    hero: {
      eyebrow: "تواصل معنا",
      title: "لنتحدّث.",
      sub: "سؤال أو مشروع؟ راسلنا، اتصل بنا، أو زرنا."
    },
    form: {
      name: "الاسم الكامل",
      email: "البريد المهني",
      company: "الشركة",
      need: "حاجتك",
      needOpts: ["أتمتة سير العمل", "جمع عملاء مؤهّلين", "إعادة بناء / إنشاء موقع", "أخرى"],
      message: "صِف مشروعك",
      submit: "أرسل طلبي",
      sending: "جارٍ الإرسال…",
      sent: "تم إرسال الرسالة ✓",
      sentSub: "سنعاود التواصل خلال ٢٤ ساعة.",
      again: "أرسل رسالة أخرى"
    },
    info: {
      eyebrow: "بيانات التواصل",
      emailLabel: "البريد الإلكتروني",
      email: "contact@agentrix-ia.com",
      phoneLabel: "الهاتف",
      phone: "+212 661 151 480",
      addressLabel: "العنوان",
      address: "شارع الحسن، زنقة بوندوكية\n30050، فاس، المغرب",
      mapLabel: "موقعنا"
    }
  },
  footer: {
    tagline: "وكلاء مستقلون يفكّرون ويخطّطون وينفّذون، ليعيدوا إليك وقتك.",
    product: "المنتج",
    company: "الشركة",
    contact: "تواصل",
    rights: "© ٢٠٢٦ Agentrix-IA. جميع الحقوق محفوظة.",
    cta: "اتصل بنا"
  }
};

// Table consolidée + registre des langues
window.I18N = { fr: window.I18N_FR, en: window.I18N_EN, ar: window.I18N_AR };
