// Clients affichés dans le bandeau « Ils automatisent avec Agentrix » de l'accueil.
// Chaque entrée : name (affiché dans le défilement) + works (travaux réalisés, par langue).
// Uniquement des travaux réels, validés par le client. Le nom doit être identique à
// `company` dans testimonials-data.js pour que la carte propose le lien vers son témoignage.
window.CLIENTS_DATA = [
  { name: "La Table Asiatique", works: {
    fr: ["Site web moderne, optimisé pour le SEO et le GEO"],
    en: ["Modern website optimized for SEO and GEO"],
    ar: ["موقع إلكتروني حديث محسّن لمحركات البحث ومحركات الإجابة (SEO وGEO)"] } },
  { name: "Les Greniers du Saiss", works: {
    fr: ["Site web moderne, optimisé pour le SEO et le GEO"],
    en: ["Modern website optimized for SEO and GEO"],
    ar: ["موقع إلكتروني حديث محسّن لمحركات البحث ومحركات الإجابة (SEO وGEO)"] } },
  { name: "Institut B", works: {
    fr: ["Agent IA de prise de rendez-vous", "Rappels de confirmation automatiques"],
    en: ["AI agent for appointment booking", "Automatic confirmation reminders"],
    ar: ["وكيل ذكاء اصطناعي لحجز المواعيد", "تذكيرات تأكيد تلقائية"] } },
  { name: "Caftan By Nadia Benkirane", works: {
    fr: ["Création de contenu pour les réseaux sociaux", "Site web"],
    en: ["Social media content creation", "Website"],
    ar: ["إنشاء محتوى لوسائل التواصل الاجتماعي", "موقع إلكتروني"] } },
  { name: "Arena Alu", works: {
    fr: ["Suivi des recouvrements"],
    en: ["Receivables collection follow-up"],
    ar: ["متابعة تحصيل المستحقات"] } },
  { name: "Best Façade", works: {
    fr: ["CRM pour la gestion", "Agent IA pour le suivi du service après-vente"],
    en: ["CRM for management", "AI agent for after-sales follow-up"],
    ar: ["نظام CRM للإدارة", "وكيل ذكاء اصطناعي لمتابعة خدمة ما بعد البيع"] } },
  { name: "Le Comptoir", works: {
    fr: ["Agent IA de relance des devis", "Suivi commercial par e-mail et WhatsApp"],
    en: ["AI agent for quote follow-ups", "Sales follow-up by email and WhatsApp"],
    ar: ["وكيل ذكاء اصطناعي لمتابعة عروض الأسعار", "متابعة تجارية عبر البريد الإلكتروني وواتساب"] } },
  { name: "École Art'Dent", works: {
    fr: ["Agent WhatsApp pour les prospects : réponses sur les filières, les frais, les conditions d'admission et les dates, puis transfert à l'équipe pour l'inscription",
         "Relances automatiques des frais de scolarité par WhatsApp, avec suivi des paiements",
         "Site web",
         "Contenu pour les réseaux sociaux préparé chaque semaine : travaux des étudiants, témoignages, journées portes ouvertes"],
    en: ["WhatsApp agent for prospects: answers on programs, fees, admission requirements and dates, then hands over to the team for enrollment",
         "Automatic tuition fee reminders on WhatsApp, with payment tracking",
         "Website",
         "Social media content prepared every week: student work, testimonials, open days"],
    ar: ["وكيل واتساب للمهتمين: إجابات حول التخصصات والرسوم وشروط القبول والمواعيد، ثم تحويل إلى الفريق للتسجيل",
         "تذكيرات تلقائية برسوم الدراسة عبر واتساب مع متابعة المدفوعات",
         "موقع إلكتروني",
         "محتوى لوسائل التواصل الاجتماعي يُحضَّر أسبوعياً: أعمال الطلاب والشهادات وأيام الأبواب المفتوحة"] } }
];
