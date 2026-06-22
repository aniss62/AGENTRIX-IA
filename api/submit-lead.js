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
        "<p><strong>Projet :</strong> " + esc(message) + "</p>",
        "<p><strong>Date :</strong> " + date + "</p>"
      ].join("")
    })
  });
  var data = await res.json();
  if (!res.ok) throw new Error("Resend " + res.status + ": " + JSON.stringify(data));
  return data.id;
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

  var emailId;
  try {
    emailId = await withRetry(function () { return sendEmail(nom, email, message); }, 3, 500);
  } catch (err) {
    console.error("[submit-lead] Resend error after 3 retries:", err.message);
    return res.status(502).json({ error: "resend", detail: err.message });
  }

  return res.status(200).json({ ok: true, emailId: emailId });
};
