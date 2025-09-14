// Test script for production email functionality
const fetch = require('node-fetch');
require('dotenv').config();

const PRODUCTION_URL = 'https://apple-interiors.vercel.app/api/send-email';

async function testProductionEmail() {
    console.log('🚀 Testing production email endpoint...');
    
    const testData = {
        formData: {
            name: "Production Test User",
            email: "test@example.com",
            phone: "+911234567890",
            subject: "Production Test Email",
            message: "This is a test email from production environment."
        }
    };

    try {
        console.log('📤 Sending test data to:', PRODUCTION_URL);
        console.log('📝 Test data:', JSON.stringify(testData, null, 2));

        const response = await fetch(PRODUCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        console.log('📥 Response status:', response.status);
        
        const result = await response.text();
        let jsonResult;
        
        try {
            jsonResult = JSON.parse(result);
            console.log('📄 Response data:', JSON.stringify(jsonResult, null, 2));
        } catch (e) {
            console.log('📄 Raw response:', result);
            throw new Error(`Failed to parse JSON response: ${result}`);
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('✅ Test email sent successfully! Check your inbox.');
    } catch (error) {
        console.error('❌ Error sending test email:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        
        if (error.cause) {
            console.error('Error cause:', error.cause);
        }
    }
}

testProductionEmail();
