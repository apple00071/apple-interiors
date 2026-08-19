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
const META_ACCESS_TOKEN   = process.env.META_ACCESS_TOKEN || '';
const META_PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID || '';
const META_VERIFY_TOKEN   = process.env.META_VERIFY_TOKEN || process.env.WEBHOOK_SECRET || 'apple_interiors_meta_token_2026';

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

// ── Send WhatsApp message ─────────────────────────────────────────────────────
async function sendWhatsApp(to, text) {
  const formattedTo = formatPhone(to);
  console.log(`[WhatsApp Bot] Sending message to: ${formattedTo}...`);

  // 1. Send via Meta WhatsApp Cloud API if configured
  if (META_ACCESS_TOKEN && META_PHONE_NUMBER_ID) {
    try {
      const res = await fetch(`https://graph.facebook.com/v19.0/${META_PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${META_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: formattedTo,
          type: 'text',
          text: { preview_url: false, body: text }
        })
      });
      const resData = await res.json().catch(() => ({}));
      console.log(`[WhatsApp Bot] Meta Cloud API response:`, res.status, JSON.stringify(resData));
      return;
    } catch (err) {
      console.error('[WhatsApp Bot] Meta Cloud API error:', err.message);
    }
  }

  // 2. Fallback to WASenderApi / WeSender
  if (!WESENDER_API_KEY) {
    console.warn('[WhatsApp Bot] No WhatsApp API credentials configured (Meta or WASenderApi) — skipping send');
    return;
  }
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

// ── Send Interactive Buttons / Poll via WASenderApi ───────────────────────────
async function sendWhatsAppPoll(to, question, options) {
  const formattedTo = formatPhone(to);
  if (!WESENDER_API_KEY) return;
  console.log(`[WhatsApp Bot] Sending interactive options to: ${formattedTo}...`);
  try {
    const res = await fetch(WESENDER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WESENDER_API_KEY}`
      },
      body: JSON.stringify({
        to: formattedTo,
        poll: {
          question: question,
          options: options,
          multiSelect: false
        }
      })
    });
    const resData = await res.json().catch(() => ({}));
    console.log(`[WhatsApp Bot] Send interactive options response:`, res.status, JSON.stringify(resData));
    if (!res.ok) {
      // Fallback to text message if poll not supported by device
      console.warn('[WhatsApp Bot] Poll fallback to text');
      const textFallback = `${question}\n\n` + options.map((opt, i) => `${i + 1}️⃣ ${opt}`).join('\n');
      await sendWhatsApp(to, textFallback);
    }
  } catch (err) {
    console.error('[WhatsApp Bot] WASenderApi poll failed:', err.message);
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
  // ── 1. Meta Webhook Verification (GET request) ──────────────────────────────
  if (req.method === 'GET') {
    const mode = req.query?.['hub.mode'] || req.query?.mode;
    const token = req.query?.['hub.verify_token'] || req.query?.verify_token;
    const challenge = req.query?.['hub.challenge'] || req.query?.challenge;

    const expectedToken = process.env.META_VERIFY_TOKEN || process.env.WEBHOOK_SECRET || 'apple_interiors_meta_token_2026';

    if (mode === 'subscribe' && token === expectedToken) {
      console.log('[WhatsApp Bot] Meta Webhook verified successfully!');
      return res.status(200).send(challenge);
    } else if (token === expectedToken || token === WEBHOOK_SECRET) {
      return res.status(200).send(challenge || 'OK');
    }

    console.warn('[WhatsApp Bot] Meta Webhook verification failed. Token mismatch.');
    return res.status(403).json({ error: 'Verification token mismatch' });
  }

  // Only accept POST for incoming events
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
      // Only block if header was provided but incorrect
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const body = req.body;

  let phone, text;

  try {
    // Check if Meta Cloud API format
    if (body?.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const change = entry?.changes?.[0]?.value;
      const message = change?.messages?.[0];

      if (!message) {
        // Status update or non-message event (e.g. delivered, read)
        return res.status(200).json({ ok: true, ignored: 'status_update' });
      }

      phone = message.from;
      if (message.type === 'text') {
        text = message.text?.body || '';
      } else if (message.type === 'interactive') {
        text = message.interactive?.button_reply?.title ||
               message.interactive?.button_reply?.id ||
               message.interactive?.list_reply?.title ||
               message.interactive?.list_reply?.id || '';
      } else if (message.type === 'button') {
        text = message.button?.text || '';
      }
    } else {
      // Legacy / WASenderApi / Evolution format
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

      // Handle Poll / Button Results (user clicked an option button)
      if (body?.event === 'poll.results' && Array.isArray(data?.pollResult)) {
        for (const opt of data.pollResult) {
          if (Array.isArray(opt.voters) && opt.voters.some(v => v.includes(phone))) {
            text = opt.name;
            break;
          }
        }
      }

      // Extract text from various message types if not already from poll
      if (!text) {
        text = (
          msgObj?.messageBody ||
          msgObj?.conversation ||
          msgObj?.message?.conversation ||
          msgObj?.message?.extendedTextMessage?.text ||
          msgObj?.message?.pollUpdateMessage?.vote ||
          data?.messageBody ||
          data?.conversation ||
          ''
        ).trim();
      }
    }
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

  console.log(`[WhatsApp Bot] Processing message from: ${phone} | Text: "${text}" | Step: ${session.step}`);

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

    const spaceMsg =
      `Thanks *${text}*! What type of space are you looking to design?\n\n` +
      `1️⃣ *Full Home Interiors*\n` +
      `2️⃣ *Modular Kitchen*\n` +
      `3️⃣ *Office / Commercial*\n` +
      `4️⃣ *Wardrobe / False Ceiling*\n\n` +
      `_Reply with 1, 2, 3, or 4 (or type your space)_`;

    await sendWhatsApp(phone, spaceMsg);
    return res.status(200).json({ ok: true });
  }

  // ── Step 2: Space Type Selection (Smart parser) ─────────────────────────────
  if (session.step === 2) {
    let spaceChoice = text;
    const lower = text.toLowerCase();
    if (lower.includes('1') || lower.includes('home') || lower.includes('flat') || lower.includes('villa') || lower.includes('full')) {
      spaceChoice = 'Full Home Interiors';
    } else if (lower.includes('2') || lower.includes('kitchen') || lower.includes('modular')) {
      spaceChoice = 'Modular Kitchen';
    } else if (lower.includes('3') || lower.includes('office') || lower.includes('commercial') || lower.includes('shop')) {
      spaceChoice = 'Office / Commercial';
    } else if (lower.includes('4') || lower.includes('wardrobe') || lower.includes('ceiling') || lower.includes('false')) {
      spaceChoice = 'Wardrobe / False Ceiling';
    }

    session.data.space = spaceChoice;
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

    const budgetMsg =
      `💰 What is your approximate budget for the interiors?\n\n` +
      `1️⃣ *Under ₹5 Lakhs*\n` +
      `2️⃣ *₹5–10 Lakhs*\n` +
      `3️⃣ *₹10–20 Lakhs*\n` +
      `4️⃣ *₹20 Lakhs+*\n\n` +
      `_Reply with 1, 2, 3, or 4 (or type your budget)_`;

    await sendWhatsApp(phone, budgetMsg);
    return res.status(200).json({ ok: true });
  }

  // ── Step 4: Budget Selection & Finalizing Lead ──────────────────────────────
  if (session.step >= 4) {
    let budgetChoice = text;
    const lower = text.toLowerCase();
    if (lower === '1' || lower.includes('under 5') || lower.includes('less than 5')) {
      budgetChoice = 'Under ₹5 Lakhs';
    } else if (lower === '2' || lower.includes('5-10') || lower.includes('5 to 10')) {
      budgetChoice = '₹5–10 Lakhs';
    } else if (lower === '3' || lower.includes('10-20') || lower.includes('10 to 20')) {
      budgetChoice = '₹10–20 Lakhs';
    } else if (lower === '4' || lower.includes('20+') || lower.includes('above 20')) {
      budgetChoice = '₹20 Lakhs+';
    }

    session.data.budget = budgetChoice;
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
