const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testContactAPI() {
    const testData = {
        fullName: "Test User",
        emailAddress: "test@example.com",
        phoneNumber: "+91 9876543210",
        propertyType: "Apartment",
        projectLocation: "Hyderabad",
        budget: "₹5-10 Lakhs",
        projectMessage: "This is a test message to verify that the project message appears in both admin and customer emails."
    };

    try {
        console.log('🧪 Testing Contact API...');
        console.log('📤 Sending test data:', testData);
        
        const response = await fetch('http://localhost:3000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();
        
        console.log('📥 Response Status:', response.status);
        console.log('📥 Response Data:', result);
        
        if (result.success) {
            console.log('✅ Contact API test successful!');
            console.log('📧 Admin email sent:', result.adminEmailSent);
            console.log('📧 Customer email sent:', result.customerEmailSent);
        } else {
            console.log('❌ Contact API test failed:', result.error);
        }
        
    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
    }
}

testContactAPI();
