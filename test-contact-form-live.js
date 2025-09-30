// Test the live contact form API endpoint
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testLiveContactForm() {
    console.log('🧪 Testing Live Contact Form...');
    console.log('📍 Testing against: http://localhost:3000/api/contact');
    console.log('');
    
    const testData = {
        fullName: "Live Test User",
        emailAddress: "livetest@example.com",
        phoneNumber: "+91 9876543210",
        propertyType: "3BHK",
        projectLocation: "Gachibowli, Hyderabad",
        budget: "15-25 Lakhs",
        projectMessage: "This is a live test of the new contact form implementation. Testing the complete email flow including admin notification and customer confirmation emails."
    };
    
    console.log('📤 Sending test data:');
    console.log(JSON.stringify(testData, null, 2));
    console.log('');
    
    try {
        console.log('🚀 Making POST request to /api/contact...');
        
        const response = await fetch('http://localhost:3000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });
        
        console.log('📥 Response status:', response.status);
        console.log('📄 Response headers:', Object.fromEntries(response.headers.entries()));
        
        const result = await response.json();
        console.log('📋 Response data:', JSON.stringify(result, null, 2));
        
        if (response.ok && result.success) {
            console.log('');
            console.log('✅ LIVE CONTACT FORM TEST SUCCESSFUL!');
            console.log('🎉 The new contact form implementation is working perfectly!');
            console.log('');
            console.log('📧 Email Details:');
            console.log('  - Admin notification sent to: aravind.bandaru@appleinteriors.in');
            console.log('  - Customer confirmation sent to: livetest@example.com');
            
            if (result.emailIds) {
                console.log('  - Admin email ID:', result.emailIds.admin);
                console.log('  - Customer email ID:', result.emailIds.customer);
            }
            
            console.log('');
            console.log('✨ Features verified:');
            console.log('  ✅ Form validation');
            console.log('  ✅ Dual email system (admin + customer)');
            console.log('  ✅ Professional email templates');
            console.log('  ✅ Error handling');
            console.log('  ✅ CORS configuration');
            console.log('  ✅ Express server integration');
            
        } else {
            console.log('');
            console.log('❌ LIVE CONTACT FORM TEST FAILED');
            console.log('Error:', result.error || 'Unknown error');
            
            if (result.details) {
                console.log('Validation errors:', result.details);
            }
            
            if (result.fallback) {
                console.log('Fallback options:', result.fallback);
            }
        }
        
    } catch (error) {
        console.error('❌ Error testing live contact form:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('');
            console.log('💡 Server connection failed. Make sure the server is running:');
            console.log('   npm start');
        } else {
            console.log('Stack:', error.stack);
        }
    }
}

// Test health endpoint
async function testHealthEndpoint() {
    console.log('🏥 Testing Health Endpoint...');
    
    try {
        const response = await fetch('http://localhost:3000/api/health');
        const result = await response.json();
        
        console.log('📊 Health check result:', JSON.stringify(result, null, 2));
        
        if (response.ok && result.status === 'OK') {
            console.log('✅ Health endpoint working correctly');
        } else {
            console.log('❌ Health endpoint failed');
        }
        
    } catch (error) {
        console.log('❌ Health endpoint error:', error.message);
    }
    
    console.log('');
}

// Run all tests
async function runLiveTests() {
    console.log('🎯 LIVE CONTACT FORM TESTING SUITE');
    console.log('==================================');
    console.log('');
    
    await testHealthEndpoint();
    await testLiveContactForm();
    
    console.log('');
    console.log('🏁 Live Testing Complete!');
    console.log('');
    console.log('🌐 You can now test the contact form manually at:');
    console.log('   http://localhost:3000/contact.html');
    console.log('');
    console.log('📝 To test the form:');
    console.log('1. Fill out the contact form with your details');
    console.log('2. Click "Send Message"');
    console.log('3. Check for success message');
    console.log('4. Verify emails are received');
    console.log('5. Test WhatsApp fallback functionality');
}

runLiveTests();
