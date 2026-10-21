// Témoignages clients — UNIQUEMENT des retours réels, publiés avec l'accord écrit de la personne.
// Ne jamais inventer, compléter ou reformuler une citation sans validation du client.
//
// Format d'une entrée :
//   { quote: "Citation exacte.", name: "Prénom Nom", role: "Fonction", company: "Entreprise" }
//
// Tant que la liste est vide, la page /temoignages/ affiche un message d'attente, n'est pas
// liée dans la navigation et est exclue de Google (noindex, voir scripts/build.mjs).
// Dès qu'il y a des citations réelles : ajouter l'entrée "testimonials" dans la navigation
// (agentrix/nav.jsx), passer `noindex: false` et ajouter un bloc `sitemap` à la page dans
// scripts/build.mjs.
window.TESTIMONIALS = [];
