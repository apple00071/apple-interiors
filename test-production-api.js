const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testProductionAPI() {
    const testData = {
        fullName: "Production Test User",
        emailAddress: "test@example.com",
        phoneNumber: "+91 9876543210",
        propertyType: "Villa",
        projectLocation: "Hyderabad",
        budget: "₹10-15 Lakhs",
        projectMessage: "This is a production test message to verify that the API endpoint is working and the project message appears in both admin and customer emails."
    };

    try {
        console.log('🧪 Testing Production Contact API...');
        console.log('🌐 Testing URL: https://appleinteriors.in/api/contact');
        console.log('⏰ Testing after fresh deployment...');
        console.log('📤 Sending test data:', testData);
        
        const response = await fetch('https://appleinteriors.in/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        console.log('📥 Response Status:', response.status);
        console.log('📥 Response Headers:', Object.fromEntries(response.headers.entries()));
        
        const responseText = await response.text();
        console.log('📥 Raw Response:', responseText);
        
        try {
            const result = JSON.parse(responseText);
            console.log('📥 Parsed Response Data:', result);
            
            if (result.success) {
                console.log('✅ Production Contact API test successful!');
                console.log('📧 Email IDs:', result.emailIds);
            } else {
                console.log('❌ Production Contact API test failed:', result.error);
            }
        } catch (parseError) {
            console.log('❌ Failed to parse JSON response:', parseError.message);
            console.log('📄 This might be an HTML error page instead of JSON');
        }
        
    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
    }
}

testProductionAPI();
