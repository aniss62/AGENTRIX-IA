// Agentrix — lead submission: Airtable write + Resend notification
const AIRTABLE_BASE  = "appcoqhKXGbCttULR";
const AIRTABLE_TABLE = "Leads";
const NOTIFY_EMAIL   = "anisssebbane@gmail.com";

const MAX = { nom: 120, email: 254, message: 4000 };
const ALLOWED_ORIGINS = ["https://www.agentrix-ia.com", "https://agentrix-ia.com"];

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

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
      subject: "Nouveau lead — " + esc(nom),
      html: [
        "<h2>Nouveau lead Agentrix·IA</h2>",
        "<p><strong>Nom :</strong> " + esc(nom) + "</p>",
        "<p><strong>Email :</strong> " + esc(email) + "</p>",
        "<p><strong>Projet :</strong> " + esc(message).replace(/\n/g, "<br>") + "</p>",
        "<p><strong>Date :</strong> " + date + "</p>"
      ].join("")
    })
  });
  var data = await res.json();
  if (!res.ok) throw new Error("Resend " + res.status);
  return data.id;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });

  // Un navigateur envoie toujours Origin sur un POST : on refuse les autres sites.
  var origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.indexOf(origin) === -1) return res.status(403).json({ error: "origin" });

  var body = req.body || {};
  var nom     = body.nom;
  var email   = body.email;
  var message = body.message;

  if (typeof nom !== "string" || typeof email !== "string" || typeof message !== "string") {
    return res.status(400).json({ error: "missing" });
  }
  // Retire les retours à la ligne du nom (sujet d'email) et les espaces superflus.
  nom     = nom.replace(/[\r\n\t]+/g, " ").trim();
  email   = email.trim();
  message = message.trim();

  if (!nom || !email || !message) return res.status(400).json({ error: "missing" });
  if (nom.length > MAX.nom || email.length > MAX.email || message.length > MAX.message) {
    return res.status(400).json({ error: "too_long" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "email" });

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
