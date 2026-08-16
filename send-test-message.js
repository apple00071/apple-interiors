const API_KEY = '3a958f97a6bb9f776aef2aa3489a5a3127042ccbe4a7125efa0a98c362ecbdc0';
const SALES_NUMBER = '918247494622';
const ENDPOINT = 'https://www.wasenderapi.com/api/send-message';

async function sendTest() {
  console.log(`Sending live test WhatsApp message to +${SALES_NUMBER} via ${ENDPOINT}...`);

  const payload = {
    to: SALES_NUMBER,
    text: `🔔 *Apple Interiors — Lead Bot Test*\n\n` +
          `👤 *Name:* Test Customer\n` +
          `📱 *WhatsApp:* wa.me/919160577899\n` +
          `🏠 *Space:* Full Home Interiors\n` +
          `📍 *Area:* Gachibowli, Hyderabad\n` +
          `💰 *Budget:* ₹10–20 Lakhs\n\n` +
          `_WhatsApp Lead Qualification Bot is connected successfully!_ ✅`
  };

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    console.log(`HTTP Status: ${res.status} ${res.statusText}`);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));

    if (res.ok && data.success !== false) {
      console.log('🎉 Test message sent successfully to sales team WhatsApp (+91 82474 94622)!');
    } else {
      console.log('⚠️ Response indicates an issue:', data);
    }
  } catch (err) {
    console.error('❌ Error sending message:', err.message);
  }
}

sendTest();
