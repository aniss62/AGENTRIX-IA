# Resend Notification — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Envoyer un email de notification à anisssebbane@gmail.com via Resend à chaque soumission du formulaire lead, avec garantie de fiabilité (retry x3, pas de fire-and-forget).

**Architecture:** Le formulaire appelle une seule route Vercel `/api/submit-lead` qui centralise l'enregistrement Airtable et l'envoi email Resend en séquence. Le formulaire attend la réponse avant d'afficher "Envoyé" ou une erreur.

**Tech Stack:** Vercel Serverless Functions (Node 18, native fetch), Resend REST API, Airtable REST API, React (Babel standalone)

---

## File Map

| Fichier | Action | Rôle |
|---|---|---|
| `api/submit-lead.js` | Créer | Fonction Vercel : Airtable + Resend avec retry |
| `package.json` | Créer | Déclare Node 18 pour Vercel |
| `vercel.json` | Créer | Config Vercel minimaliste |
| `agentrix/i18n-data.js` | Modifier | Ajoute les clés d'erreur (3 langues) |
| `agentrix/home-sections.jsx` | Modifier | Nouveau submit + état "error" |
| `agentrix/airtable.js` | Modifier | Vide le fichier (remplacé côté serveur) |
| `index.html` | Modifier | Supprime le `<script>` vers `airtable.js` |

---

## Task 1 : Fichiers de configuration Vercel

**Files:**
- Create: `package.json`
- Create: `vercel.json`

- [ ] **Créer `package.json`**

```json
{
  "name": "agentrix-site",
  "version": "1.0.0",
  "engines": { "node": "18.x" }
}
```

- [ ] **Créer `vercel.json`**

```json
{
  "version": 2
}
```

Vercel détecte automatiquement les fichiers statiques à la racine et les fonctions dans `/api`.

- [ ] **Commit**

```bash
git add package.json vercel.json
git commit -m "chore: add Vercel project config"
```

---

## Task 2 : Fonction serverless `api/submit-lead.js`

**Files:**
- Create: `api/submit-lead.js`

- [ ] **Créer le fichier `api/submit-lead.js` avec ce contenu exact :**

```js
// Agentrix — lead submission: Airtable write + Resend notification
const AIRTABLE_BASE  = "appcoqhKXGbCttULR";
const AIRTABLE_TABLE = "Leads";
const NOTIFY_EMAIL   = "anisssebbane@gmail.com";

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function withRetry(fn, retries, delay) {
  for (var i = 0; i < retries; i++) {
    try { return await fn(); }
    catch (err) {
      if (i === retries - 1) throw err;
      await sleep(delay);
    }
  }
}

async function saveToAirtable(nom, email, message) {
  var res = await fetch("https://api.airtable.com/v0/" + AIRTABLE_BASE + "/" + AIRTABLE_TABLE, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + process.env.AIRTABLE_TOKEN,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      records: [{ fields: {
        "Nom complet": nom,
        "Email":       email,
        "Message":     message,
        "Date":        new Date().toISOString(),
        "Statut":      "Nouveau"
      }}]
    })
  });
  if (!res.ok) throw new Error("Airtable " + res.status);
}

async function sendEmail(nom, email, message) {
  var date = new Date().toLocaleString("fr-FR", { timeZone: "Africa/Casablanca" });
  var res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + process.env.RESEND_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Agentrix <onboarding@resend.dev>",
      to:   [NOTIFY_EMAIL],
      subject: "Nouveau lead — " + nom,
      html: [
        "<h2>Nouveau lead Agentrix·IA</h2>",
        "<p><strong>Nom :</strong> " + nom + "</p>",
        "<p><strong>Email :</strong> " + email + "</p>",
        "<p><strong>Projet :</strong> " + message + "</p>",
        "<p><strong>Date :</strong> " + date + "</p>"
      ].join("")
    })
  });
  if (!res.ok) {
    var body = await res.text();
    throw new Error("Resend " + res.status + ": " + body);
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });

  var nom     = (req.body || {}).nom;
  var email   = (req.body || {}).email;
  var message = (req.body || {}).message;

  if (!nom || !email || !message) return res.status(400).json({ error: "missing" });

  try {
    await saveToAirtable(nom, email, message);
  } catch (err) {
    console.error("[submit-lead] Airtable error:", err.message);
    return res.status(502).json({ error: "airtable" });
  }

  try {
    await withRetry(function () { return sendEmail(nom, email, message); }, 3, 500);
  } catch (err) {
    console.error("[submit-lead] Resend error after 3 retries:", err.message);
    return res.status(502).json({ error: "resend" });
  }

  return res.status(200).json({ ok: true });
};
```

- [ ] **Commit**

```bash
git add api/submit-lead.js
git commit -m "feat: add /api/submit-lead serverless function (Airtable + Resend)"
```

---

## Task 3 : Clés i18n pour l'état erreur

**Files:**
- Modify: `agentrix/i18n-data.js`

Il n'existe pas encore de clés `errorTitle` / `errorRetry` dans les 3 langues. Les ajouter juste après `emailInvalid` dans chaque bloc.

- [ ] **FR — après la ligne `emailInvalid: "Adresse e-mail invalide",` (ligne ≈115)**

Remplacer :
```js
      emailInvalid: "Adresse e-mail invalide",
```
Par :
```js
      emailInvalid: "Adresse e-mail invalide",
      errorTitle: "Une erreur est survenue",
      errorRetry: "Veuillez réessayer.",
```

- [ ] **EN — après la ligne `emailInvalid: "Invalid email address",` (ligne ≈381)**

Remplacer :
```js
      emailInvalid: "Invalid email address",
```
Par :
```js
      emailInvalid: "Invalid email address",
      errorTitle: "Something went wrong",
      errorRetry: "Please try again.",
```

- [ ] **AR — après la ligne `emailInvalid: "بريد إلكتروني غير صالح",` (ligne ≈647)**

Remplacer :
```js
      emailInvalid: "بريد إلكتروني غير صالح",
```
Par :
```js
      emailInvalid: "بريد إلكتروني غير صالح",
      errorTitle: "حدث خطأ",
      errorRetry: "يرجى المحاولة مرة أخرى.",
```

- [ ] **Commit**

```bash
git add agentrix/i18n-data.js
git commit -m "feat: add error i18n keys (fr/en/ar)"
```

---

## Task 4 : Mise à jour du formulaire `home-sections.jsx`

**Files:**
- Modify: `agentrix/home-sections.jsx`

Deux changements : (a) la fonction `submit`, (b) ajout du bloc de rendu état `"error"`.

- [ ] **Remplacer la fonction `submit` (lignes 23-36)**

Remplacer :
```js
  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    const nom = [v.name.trim(), v.first.trim()].filter(Boolean).join(" ");
    window.sendToAirtable({
      nom,
      email:   v.email.trim(),
      message: v.project.trim(),
    }).catch(function () {}).then(function () {
      setStatus("sent");
      if (onDone) onDone(v);
    });
  };
```
Par :
```js
  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    const nom = [v.name.trim(), v.first.trim()].filter(Boolean).join(" ");
    fetch("/api/submit-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, email: v.email.trim(), message: v.project.trim() })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.ok) { setStatus("sent"); if (onDone) onDone(v); }
        else { setStatus("error"); }
      })
      .catch(function () { setStatus("error"); });
  };
```

- [ ] **Ajouter le bloc état `"error"` juste après le bloc `status === "sent"` (après la ligne 51)**

Ajouter après le bloc `if (status === "sent") { ... }` :
```jsx
  if (status === "error") {
    return (
      <div className={`leadf__success ${variant === "chat" ? "leadf__success--chat" : ""}`}>
        <div className="leadf__success-ic" style={{ color: "#e55" }}><Icon name="close" size={variant === "chat" ? 20 : 26} /></div>
        <div className="leadf__success-txt">
          <strong>{t("home.lead.errorTitle")}</strong>
          <span className="muted">{t("home.lead.errorRetry")}</span>
        </div>
        <Btn variant="ghost" onClick={reset}>{t("home.lead.again")}</Btn>
      </div>
    );
  }
```

- [ ] **Commit**

```bash
git add agentrix/home-sections.jsx
git commit -m "feat: wire form to /api/submit-lead, add error state"
```

---

## Task 5 : Nettoyer `airtable.js` et `index.html`

**Files:**
- Modify: `agentrix/airtable.js`
- Modify: `index.html`

`sendToAirtable` est maintenant côté serveur — supprimer le fichier client et son tag `<script>`.

- [ ] **Vider `agentrix/airtable.js`**

Remplacer tout le contenu par :
```js
// Replaced by /api/submit-lead (Vercel serverless function)
```

- [ ] **Retirer le tag `<script>` dans `index.html` (ligne 38)**

Supprimer la ligne :
```html
  <!-- airtable lead helper (plain JS, no Babel) -->
  <script src="agentrix/airtable.js"></script>
```

- [ ] **Commit**

```bash
git add agentrix/airtable.js index.html
git commit -m "chore: remove client-side Airtable helper (moved to serverless function)"
```

---

## Task 6 : Test local avec Vercel CLI

- [ ] **Installer Vercel CLI (si pas déjà fait)**

```bash
npm install -g vercel
```

- [ ] **Lancer le serveur de dev**

```bash
cd "/Users/mac/ANTIGRAVITY/Site Agentrix"
vercel dev
```

Vercel lit automatiquement les variables depuis `.env`. Le site est disponible sur `http://localhost:3000`.

- [ ] **Tester la fonction avec curl**

```bash
curl -X POST http://localhost:3000/api/submit-lead \
  -H "Content-Type: application/json" \
  -d '{"nom":"Test User","email":"test@example.com","message":"Test projet"}'
```

Réponse attendue : `{"ok":true}`

- [ ] **Vérifier dans Airtable** que le lead "Test User" est apparu dans la table Leads.

- [ ] **Vérifier dans Gmail** que l'email de notification est arrivé à anisssebbane@gmail.com.

- [ ] **Tester le formulaire dans le navigateur** sur `http://localhost:3000` :
  - Remplir nom, email, projet → cliquer "Être recontacté"
  - Le bouton doit passer en état "Envoi…" puis afficher le message de succès
  - Un email doit arriver dans la boîte Gmail

---

## Task 7 : Déploiement Vercel + variables d'environnement

- [ ] **Ajouter les variables dans le dashboard Vercel**

Aller sur [vercel.com](https://vercel.com) → Projet Agentrix → Settings → Environment Variables, ajouter :

| Name | Value |
|---|---|
| `AIRTABLE_TOKEN` | `<voir .env>` |
| `RESEND_API_KEY` | (valeur dans `.env`) |

Cocher les environnements : **Production**, **Preview**, **Development**.

- [ ] **Déployer**

```bash
vercel --prod
```

Ou si le projet est connecté à un repo GitHub : pusher la branche, Vercel déploie automatiquement.

- [ ] **Test de smoke sur la prod**

```bash
curl -X POST https://<votre-domaine>.vercel.app/api/submit-lead \
  -H "Content-Type: application/json" \
  -d '{"nom":"Smoke Test","email":"anisssebbane@gmail.com","message":"Test prod"}'
```

Réponse attendue : `{"ok":true}` + email reçu dans Gmail.
