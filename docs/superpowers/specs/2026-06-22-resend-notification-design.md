# Design : Notification email Resend à chaque nouveau lead

**Date :** 2026-06-22
**Statut :** Approuvé

---

## Contexte

Le site Agentrix est une application statique (HTML + React via Babel standalone, sans bundler). Le formulaire lead dans `home-sections.jsx` envoie actuellement les données directement à Airtable via `airtable.js` côté navigateur. L'objectif est d'envoyer une notification email à `anisssebbane@gmail.com` via Resend.com à chaque soumission réussie.

## Objectif

- Recevoir un email de notification à chaque nouveau lead soumis
- La notification doit réussir à chaque fois (fiabilité garantie)
- Aucune régression sur le comportement existant du formulaire

---

## Architecture

```
Formulaire (browser)
  └── fetch POST /api/submit-lead   ← unique point d'entrée
            │
            ▼
   Vercel Serverless Function (Node.js)
      ├── 1. POST Airtable REST API  → enregistre le lead
      ├── 2. POST Resend API         → envoie l'email (retry x3)
      └── 3. Retourne { ok: true } ou { error: "..." }
            │
            ▼
   Formulaire affiche succès ou erreur
```

---

## Fichiers

### Créés

| Fichier | Rôle |
|---|---|
| `api/submit-lead.js` | Fonction Vercel : Airtable + Resend |
| `vercel.json` | Config Vercel : site statique + routes API |

### Modifiés

| Fichier | Changement |
|---|---|
| `agentrix/airtable.js` | Suppression de `sendToAirtable` (remplacé par l'API route) |
| `agentrix/home-sections.jsx` | `submit()` appelle `/api/submit-lead` au lieu de `sendToAirtable` |

---

## Spécification : `api/submit-lead.js`

**Entrée (POST JSON)**
```json
{ "nom": "string", "email": "string", "message": "string" }
```

**Logique**
1. Valider que `nom`, `email`, `message` sont présents — sinon `400`
2. Appeler Airtable REST API :
   - Base : `appcoqhKXGbCttULR` · Table : `Leads`
   - Champs : `Nom complet`, `Email`, `Message`, `Date`, `Statut = "Nouveau"`
   - Token : `process.env.AIRTABLE_TOKEN`
3. Si Airtable échoue → retourner `{ error: "airtable" }` avec status `502`
4. Appeler Resend API (retry x3, 500ms entre chaque tentative) :
   - Clé : `process.env.RESEND_API_KEY`
   - From : `onboarding@resend.dev`
   - To : `anisssebbane@gmail.com`
   - Subject : `Nouveau lead — {nom}`
   - Body HTML : nom, email, message, date/heure
5. Si Resend échoue après 3 tentatives → retourner `{ error: "resend" }` avec status `502`
6. Succès → `{ ok: true }` status `200`

**Retry Resend**
```
Tentative 1 → attendre 500ms si échec
Tentative 2 → attendre 500ms si échec
Tentative 3 → échec définitif
```

---

## Spécification : `vercel.json`

```json
{
  "version": 2,
  "builds": [
    { "src": "index.html", "use": "@vercel/static" },
    { "src": "api/**/*.js", "use": "@vercel/node" }
  ]
}
```

---

## Spécification : `home-sections.jsx` (changement `submit`)

Remplacer l'appel à `window.sendToAirtable(...)` par :

```js
fetch("/api/submit-lead", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ nom, email: v.email.trim(), message: v.project.trim() })
})
  .then(r => r.json())
  .then(data => {
    if (data.ok) { setStatus("sent"); if (onDone) onDone(v); }
    else { setStatus("error"); }
  })
  .catch(() => setStatus("error"));
```

Le formulaire doit gérer un troisième état `"error"` qui affiche un message d'erreur invitant à réessayer.

---

## Variables d'environnement Vercel

À configurer dans le dashboard Vercel (Settings → Environment Variables) :

| Variable | Valeur |
|---|---|
| `AIRTABLE_TOKEN` | Personal Access Token Airtable |
| `RESEND_API_KEY` | Clé API Resend |

---

## Fiabilité

- Airtable est appelé en premier : le lead est toujours enregistré même si Resend échoue
- Resend : 3 tentatives avant échec définitif
- En cas d'échec Resend : le formulaire affiche une erreur, le prospect peut réessayer
- Aucun feu-et-oublie : le formulaire attend la réponse serveur avant d'afficher "Envoyé"

---

## Hors périmètre

- Domaine email custom (on utilise `onboarding@resend.dev`)
- File d'attente persistante (queue, dead-letter)
- Dashboard de monitoring des notifications
