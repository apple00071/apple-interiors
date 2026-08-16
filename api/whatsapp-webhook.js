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
  const fresh = { step: 0, status: 'active', data: {}, updatedAt: Date.now() };
  sessions.set(phone, fresh);
  return fresh;
}

function markSessionCompleted(phone) {
  // Keep in completed state for 24 hours so bot does not re-trigger
  const s = getSession(phone);
  s.status = 'completed';
  s.updatedAt = Date.now();
  sessions.set(phone, s);
}

function markHumanTakeover(phone) {
  // If sales team manually replies, disable bot for this contact
  const s = getSession(phone);
  s.status = 'human_takeover';
  s.updatedAt = Date.now();
  sessions.set(phone, s);
}

function formatPhone(num) {
  let cleaned = String(num || '').replace(/\D/g, '');
  if (cleaned.length === 10) cleaned = '91' + cleaned;
  return cleaned;
}

// ── Send WhatsApp message via WASenderApi ─────────────────────────────────────
async function sendWhatsApp(to, text) {
  const formattedTo = formatPhone(to);
  if (!WESENDER_API_KEY) {
    console.warn('[WhatsApp Bot] WASenderApi API key not set — skipping send');
    return;
  }
  console.log(`[WhatsApp Bot] Sending message to: ${formattedTo}...`);
  try {
    const res = await fetch(WESENDER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WESENDER_API_KEY}`
      },
      body: JSON.stringify({ to: formattedTo, text })
    });
    const resData = await res.json().catch(() => ({}));
    console.log(`[WhatsApp Bot] Send to ${formattedTo} response:`, res.status, JSON.stringify(resData));
    if (!res.ok) {
      console.error('[WhatsApp Bot] WASenderApi error:', res.status, resData);
    }
  } catch (err) {
    console.error('[WhatsApp Bot] WASenderApi fetch failed:', err.message);
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

  try {
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
  } catch (emailErr) {
    console.error('[WhatsApp Bot] Email send failed:', emailErr.message);
  }
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

  let phone, text;

  try {
    const data = body?.data || body;
    const msgObj = data?.messages || data?.message || data;
    const key = msgObj?.key || data?.key || {};

    const jid = key.cleanedSenderPn || key.remoteJid || data?.remoteJid || '';
    phone = jid.replace('@s.whatsapp.net', '').replace('@c.us', '').replace('@lid', '').trim();

    // If sales team / agent manually replies from the phone, disable bot for this contact (Human Takeover)
    if (key.fromMe) {
      if (phone) markHumanTakeover(phone);
      return res.status(200).json({ ok: true, reason: 'human_takeover_activated' });
    }

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

  // TEST MODE: Only trigger the bot for test numbers: 8247494622 and 9603960337
  const ALLOWED_TEST_NUMBERS = ['8247494622', '9603960337'];
  const isAllowed = ALLOWED_TEST_NUMBERS.some(num => phone.endsWith(num));

  if (!isAllowed) {
    console.log(`[WhatsApp Bot] Ignored message from non-test number: ${phone}`);
    return res.status(200).json({ ok: true, ignored: 'test_mode' });
  }

  const session = getSession(phone);

  // If already completed lead qualification or human takeover is active, do not interrupt
  if (session.status === 'completed' || session.status === 'human_takeover') {
    console.log(`[WhatsApp Bot] Bot is paused for ${phone} (status: ${session.status}). Human can chat freely.`);
    return res.status(200).json({ ok: true, bot_paused: session.status });
  }

  // Allow user to reset anytime by typing reset/restart
  if (/^(reset|restart|start\s*again)$/i.test(text)) {
    session.step = 0;
    session.status = 'active';
    session.data = {};
    session.updatedAt = Date.now();
    sessions.set(phone, session);
  }

  if (session.step === 0) {
    // First contact — ask question 0 (Name)
    session.step = 1;
    session.updatedAt = Date.now();
    sessions.set(phone, session);
    await sendWhatsApp(phone, STEPS[0].question);
    return res.status(200).json({ ok: true });
  }

  // ── Step 1: Validating Name ─────────────────────────────────────────────────
  if (session.step === 1) {
    const isGreeting = /^(hi+|hello+|hey+|hola|namaste|good\s*(morning|afternoon|evening|day)|gm|hy|hii+|yo)$/i.test(text);
    const isTooShort = text.length < 2;
    const isOnlyNumbers = /^\d+$/.test(text);

    if (isGreeting || isTooShort || isOnlyNumbers) {
      await sendWhatsApp(phone, '👋 Welcome! Could you please share your *name* with us so our design team can address you properly? 😊');
      return res.status(200).json({ ok: true, reprompt: 'name' });
    }

    session.data.name = text;
    session.step = 2;
    session.updatedAt = Date.now();
    sessions.set(phone, session);
    await sendWhatsApp(phone, STEPS[1].question);
    return res.status(200).json({ ok: true });
  }

  // ── Step 2: Validating Space Type ───────────────────────────────────────────
  if (session.step === 2) {
    session.data.space = text;
    session.step = 3;
    session.updatedAt = Date.now();
    sessions.set(phone, session);
    await sendWhatsApp(phone, STEPS[2].question);
    return res.status(200).json({ ok: true });
  }

  // ── Step 3: Validating Area ─────────────────────────────────────────────────
  if (session.step === 3) {
    session.data.area = text;
    session.step = 4;
    session.updatedAt = Date.now();
    sessions.set(phone, session);
    await sendWhatsApp(phone, STEPS[3].question);
    return res.status(200).json({ ok: true });
  }

  // ── Step 4: Validating Budget & Finalizing Lead ──────────────────────────────
  if (session.step >= 4) {
    session.data.budget = text;
    const d = session.data;
    const budgetMap = { '1': 'Under ₹5 Lakhs', '2': '₹5–10 Lakhs', '3': '₹10–20 Lakhs', '4': '₹20 Lakhs+' };
    const spaceMap  = { '1': 'Full Home Interiors', '2': 'Modular Kitchen', '3': 'Office / Commercial', '4': 'Wardrobe / False Ceiling' };

    // 1. Thank you to client
    await sendWhatsApp(phone,
      `✅ Thank you, *${d.name}*!\n\nWe've received your details and our team will reach out to you shortly.\n\n📞 You can also call us directly: *+91 91605 77899*\n\n_Apple Interiors — Hyderabad's Trusted Interior Designers_ 🏠`
    );

    // 2. Wait 1.5 seconds so WASenderApi queues both messages cleanly
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 3. Notify sales team
    const salesMsg =
      `🔔 *New Lead from WhatsApp Bot*\n\n` +
      `👤 *Name:* ${d.name}\n` +
      `📱 *WhatsApp:* wa.me/${formatPhone(phone)}\n` +
      `🏠 *Space:* ${spaceMap[d.space] || d.space}\n` +
      `📍 *Area:* ${d.area}\n` +
      `💰 *Budget:* ${budgetMap[d.budget] || d.budget}`;

    await sendWhatsApp(SALES_NUMBER, salesMsg);

    // 4. Send email to admin
    await sendLeadEmail(phone, d);

    // 5. Mark session as completed so bot auto-disables and steps aside for human conversation
    markSessionCompleted(phone);
    return res.status(200).json({ ok: true });
  }
};
