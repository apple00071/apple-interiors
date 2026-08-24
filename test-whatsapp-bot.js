// Quick smoke test for whatsapp-webhook.js
// Run: node test-whatsapp-bot.js
// No real API calls are made (env vars are empty)

process.env.WESENDER_API_URL = '';
process.env.WESENDER_API_KEY = '';
process.env.RESEND_API_KEY = '';
process.env.ENABLE_WHATSAPP_BOT = 'true';

const handler = require('./api/whatsapp-webhook.js');

const replies = [];

const mockReq = (text, phone = '918247494622') => ({
  method: 'POST',
  headers: {
    'x-webhook-secret': '62149449dfcfeedc290413f8174eba36'
  },
  body: {
    data: {
      key: { remoteJid: phone + '@s.whatsapp.net' },
      message: { conversation: text }
    }
  }
});

const mockRes = () => ({
  status: (code) => ({
    json: (data) => {
      console.log(`  HTTP ${code}:`, JSON.stringify(data));
    }
  })
});

// Monkey-patch sendWhatsApp to capture output instead of calling API
// We do this by temporarily replacing fetch
global.fetch = async (url, opts) => {
  const body = JSON.parse(opts.body);
  replies.push({ to: body.number, text: body.text });
  console.log(`\n  📤 Bot → ${body.number}:\n  "${body.text.replace(/\n/g, '\n  ')}"`);
  return { ok: true };
};

async function simulate() {
  const steps = [
    'Hi',           // first contact
    'Ravi Kumar',   // name
    '1',            // space: Full Home
    'Kondapur',     // area
    '2',            // budget: 5-10L
  ];

  for (let i = 0; i < steps.length; i++) {
    console.log(`\n--- Step ${i + 1}: Client sends "${steps[i]}" ---`);
    await handler(mockReq(steps[i]), mockRes());
  }

  console.log('\n✅ Test complete. Total bot messages sent:', replies.length);

  // Basic assertions
  if (replies.length < 5) {
    console.error('❌ Expected at least 5 bot messages (4 questions + 1 thank you)');
    process.exit(1);
  }

  const lastMsg = replies[replies.length - 2]; // second to last = thank you to client
  if (!lastMsg.text.includes('Thank you')) {
    console.error('❌ Expected thank you message to client');
    process.exit(1);
  }

  const salesMsg = replies[replies.length - 1]; // last = lead to sales
  if (!salesMsg.text.includes('Ravi Kumar') || !salesMsg.text.includes('Kondapur')) {
    console.error('❌ Sales notification missing lead data');
    process.exit(1);
  }

  console.log('✅ All assertions passed');
}

simulate().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
