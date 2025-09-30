// Test the contact form API endpoint
const fetch = require('node-fetch');
require('dotenv').config();

async function testContactFormAPI() {
    console.log('🧪 Testing Contact Form API Endpoint...');
    
    const testData = {
        formData: {
            name: "Test User",
            email: "test@example.com",
            phone: "+911234567890",
            subject: "Test Contact Form Submission",
            message: "This is a test message to verify the contact form API is working correctly."
        }
    };

    try {
        console.log('📤 Sending test data to API endpoint...');
        
        // Test the API endpoint directly
        const response = await fetch('http://localhost:3000/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
        }

        if (response.ok) {
            console.log('✅ Contact form API test successful!');
            console.log('📧 Check your email for the test messages.');
        } else {
            console.log('❌ Contact form API test failed.');
        }
        
    } catch (error) {
        console.error('❌ Error testing contact form API:', error.message);
        console.log('💡 Make sure to start a local server first with: npm start');
    }
}

testContactFormAPI();
