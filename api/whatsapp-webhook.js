/**
 * Apple Interiors — WhatsApp Chatbot Webhook
 * Works with WeSender (Evolution API-compatible) webhook: messages.received
 *
 * Flow:
 *   Client says anything → ask Name → Space type → Area → Budget
 *   → Send lead summary to sales WhatsApp + email
 *
 * ENV vars needed (set in Vercel dashboard):
 *   WESENDER_API_URL       e.g. https://api.wesender.io/message/sendText/INSTANCE_NAME
 *   WESENDER_API_KEY       your WeSender API key
 *   SALES_WHATSAPP_NUMBER  sales team number e.g. 919603960337 (no + or spaces)
 *   WEBHOOK_SECRET         any random string you set in WeSender webhook secret field
 *   RESEND_API_KEY         already in use by contact.js
 *   ADMIN_EMAIL            already in use by contact.js
 */

const { Resend } = require('resend');

// ── Config ────────────────────────────────────────────────────────────────────
const WESENDER_API_URL  = process.env.WESENDER_API_URL || 'https://www.wasenderapi.com/api/send-message';
const WESENDER_API_KEY  = process.env.WESENDER_API_KEY || '3a958f97a6bb9f776aef2aa3489a5a3127042ccbe4a7125efa0a98c362ecbdc0';
const SALES_NUMBER      = process.env.SALES_WHATSAPP_NUMBER || '918247494622';
const WEBHOOK_SECRET    = process.env.WEBHOOK_SECRET || '62149449dfcfeedc290413f8174eba36';
const ADMIN_EMAIL       = process.env.ADMIN_EMAIL || 'aravind.bandaru@appleinteriors.in';

// ── Bot conversation steps ────────────────────────────────────────────────────
const STEPS = [
  {
    key: 'name',
    question: '👋 Hi! I\'m the Apple Interiors assistant.\n\nMay I know your *name* please?'
  },
  {
    key: 'space',
    question: 'Thanks! What type of space are you looking to design?\n\n1️⃣ Full Home Interiors\n2️⃣ Modular Kitchen\n3️⃣ Office / Commercial\n4️⃣ Wardrobe / False Ceiling\n\nJust reply with the number or type it out.'
  },
  {
    key: 'area',
    question: '📍 Which area in Hyderabad is your property located?\n\n(e.g. Gachibowli, Kondapur, Kukatpally, Jubilee Hills, etc.)'
  },
  {
    key: 'budget',
    question: '💰 What is your approximate budget for the interiors?\n\n1️⃣ Under ₹5 Lakhs\n2️⃣ ₹5–10 Lakhs\n3️⃣ ₹10–20 Lakhs\n4️⃣ ₹20 Lakhs+\n\nJust reply with the number or your budget.'
  }
];

// ── In-memory session store ───────────────────────────────────────────────────
// ponytail: good enough for serverless cold-starts; each Vercel function instance
// keeps its own Map. For true persistence, swap with Redis/Upstash.
const sessions = new Map();
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

function getSession(phone) {
  const s = sessions.get(phone);
  if (s && Date.now() - s.updatedAt < SESSION_TTL_MS) return s;
  // expired or new
  const fresh = { step: 0, data: {}, updatedAt: Date.now() };
  sessions.set(phone, fresh);
  return fresh;
}

function clearSession(phone) {
  sessions.delete(phone);
}

// ── Send WhatsApp message via WASenderApi ─────────────────────────────────────
async function sendWhatsApp(to, text) {
  if (!WESENDER_API_KEY) {
    console.warn('WASenderApi API key not set — skipping send');
    return;
  }
  try {
    const res = await fetch(WESENDER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WESENDER_API_KEY}`
      },
      body: JSON.stringify({ to, text })
    });
    if (!res.ok) {
      const body = await res.text();
      console.error('WASenderApi error:', res.status, body);
    }
  } catch (err) {
    console.error('WASenderApi fetch failed:', err.message);
  }
}

// ── Send lead email via Resend ────────────────────────────────────────────────
async function sendLeadEmail(phone, data) {
  if (!process.env.RESEND_API_KEY) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const budgetMap = { '1': 'Under ₹5 Lakhs', '2': '₹5–10 Lakhs', '3': '₹10–20 Lakhs', '4': '₹20 Lakhs+' };
  const spaceMap  = { '1': 'Full Home Interiors', '2': 'Modular Kitchen', '3': 'Office / Commercial', '4': 'Wardrobe / False Ceiling' };

  const budget = budgetMap[data.budget] || data.budget;
  const space  = spaceMap[data.space]   || data.space;

  await resend.emails.send({
    from: 'Apple Interiors Bot <noreply@appleinteriors.in>',
    to: ADMIN_EMAIL,
    subject: `🔔 New WhatsApp Lead — ${data.name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#f9f9f9;border-radius:12px;">
        <h2 style="color:#b8932a;">🏠 New WhatsApp Lead</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Name</td><td style="padding:8px;">${data.name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">WhatsApp</td><td style="padding:8px;"><a href="https://wa.me/${phone}">+${phone}</a></td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Space Type</td><td style="padding:8px;">${space}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Area</td><td style="padding:8px;">${data.area}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Budget</td><td style="padding:8px;">${budget}</td></tr>
        </table>
        <a href="https://wa.me/${phone}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#25D366;color:white;border-radius:8px;text-decoration:none;font-weight:bold;">
          💬 Reply on WhatsApp
        </a>
      </div>
    `
  });
}

// ── Main handler ──────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Webhook secret verification (supports multiple header formats)
  if (WEBHOOK_SECRET) {
    const incomingSecret =
      req.headers['x-webhook-secret'] ||
      req.headers['webhook-secret'] ||
      req.headers['x-api-key'] ||
      req.headers['apikey'] ||
      req.headers['authorization'] ||
      '';

    if (incomingSecret && !incomingSecret.includes(WEBHOOK_SECRET)) {
      console.warn('[WhatsApp Bot] Webhook secret mismatch:', incomingSecret);
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const body = req.body;

  // WASenderApi payload format:
  // { event: "messages.received", data: { messages: { key: { cleanedSenderPn, remoteJid, fromMe }, messageBody, message: { conversation } } } }
  let phone, text;

  try {
    const data = body?.data || body;
    const msgObj = data?.messages || data?.message || data;
    const key = msgObj?.key || data?.key || {};

    // Do not process messages sent by ourselves
    if (key.fromMe) {
      return res.status(200).json({ ok: true });
    }

    const jid = key.cleanedSenderPn || key.remoteJid || data?.remoteJid || '';
    phone = jid.replace('@s.whatsapp.net', '').replace('@c.us', '').replace('@lid', '').trim();

    // Extract text from various message types
    text = (
      msgObj?.messageBody ||
      msgObj?.conversation ||
      msgObj?.message?.conversation ||
      msgObj?.message?.extendedTextMessage?.text ||
      data?.messageBody ||
      data?.conversation ||
      ''
    ).trim();
  } catch (err) {
    console.error('Payload parse error:', err.message, JSON.stringify(body));
    return res.status(200).json({ ok: true }); // always 200 to webhook sender
  }

  // TEST MODE: Only trigger the bot for test number 8247494622
  const TEST_MODE_NUMBER = process.env.TEST_PHONE_NUMBER || '8247494622';
  if (TEST_MODE_NUMBER && !phone.endsWith(TEST_MODE_NUMBER)) {
    console.log(`[WhatsApp Bot] Ignored message from non-test number: ${phone}`);
    return res.status(200).json({ ok: true, ignored: 'test_mode' });
  }

  console.log(`[WhatsApp Bot] Processing test message from: ${phone} | Text: "${text}"`);

  const session = getSession(phone);

  if (session.step === 0) {
    // First contact — ask question 0 (Name)
    session.step = 1;
    session.updatedAt = Date.now();
    sessions.set(phone, session);
    await sendWhatsApp(phone, STEPS[0].question);
    return res.status(200).json({ ok: true });
  }

  // Process answer for current step
  const currentQuestionIdx = session.step - 1;
  const currentQuestion = STEPS[currentQuestionIdx];
  if (currentQuestion) {
    session.data[currentQuestion.key] = text;
  }

  if (session.step < STEPS.length) {
    // Next question exists — ask it
    const nextQuestion = STEPS[session.step];
    session.step += 1;
    session.updatedAt = Date.now();
    sessions.set(phone, session);
    await sendWhatsApp(phone, nextQuestion.question);
    return res.status(200).json({ ok: true });
  } else {
    // All questions answered — send thank you + notify sales
    const d = session.data;
    const budgetMap = { '1': 'Under ₹5 Lakhs', '2': '₹5–10 Lakhs', '3': '₹10–20 Lakhs', '4': '₹20 Lakhs+' };
    const spaceMap  = { '1': 'Full Home Interiors', '2': 'Modular Kitchen', '3': 'Office / Commercial', '4': 'Wardrobe / False Ceiling' };

    // Thank you to client
    await sendWhatsApp(phone,
      `✅ Thank you, *${d.name}*!\n\nWe've received your details and our team will reach out to you shortly.\n\n📞 You can also call us directly: *+91 91605 77899*\n\n_Apple Interiors — Hyderabad's Trusted Interior Designers_ 🏠`
    );

    // Notify sales team
    const salesMsg =
      `🔔 *New Lead from WhatsApp Bot*\n\n` +
      `👤 *Name:* ${d.name}\n` +
      `📱 *WhatsApp:* wa.me/${phone}\n` +
      `🏠 *Space:* ${spaceMap[d.space] || d.space}\n` +
      `📍 *Area:* ${d.area}\n` +
      `💰 *Budget:* ${budgetMap[d.budget] || d.budget}`;

    await sendWhatsApp(SALES_NUMBER, salesMsg);

    // Send email to admin
    await sendLeadEmail(phone, d);

    clearSession(phone);
    return res.status(200).json({ ok: true });
  }
};
