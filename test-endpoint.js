// Test script to verify the /api/send-email endpoint
const fetch = require('node-fetch');

async function testEmailEndpoint() {
    const testData = {
        formData: {
            name: "Test User",
            email: "test@example.com",
            phone: "+911234567890",
            subject: "Test Email from Script",
            message: "This is a test message from the verification script."
        }
    };

    try {
        console.log("Sending test request to /api/send-email...");
        
        const response = await fetch('http://localhost:3000/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();
        console.log("Response status:", response.status);
        console.log("Response body:", JSON.stringify(result, null, 2));

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("✅ Test successful! Check your email for the test message.");
    } catch (error) {
        console.error("❌ Test failed:", error.message);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
    }
}

testEmailEndpoint();
