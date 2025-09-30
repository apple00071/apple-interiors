// Test the new contact form API endpoint
require('dotenv').config();

async function testNewContactAPI() {
    console.log('🧪 Testing New Contact Form API...');
    console.log('📍 API Endpoint: /api/contact');
    
    // Check environment variables
    console.log('🔑 Environment Check:');
    console.log('  - RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('  - FROM_EMAIL:', process.env.FROM_EMAIL || 'Using default');
    console.log('  - ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'Using default');
    console.log('');
    
    const testData = {
        fullName: "Test Customer",
        emailAddress: "test@example.com",
        phoneNumber: "+91 9876543210",
        propertyType: "3BHK",
        projectLocation: "Kukatpally, Hyderabad",
        budget: "10-20 Lakhs",
        projectMessage: "I am looking for a complete interior design for my new 3BHK apartment. I prefer modern contemporary style with good storage solutions. Please contact me to discuss the project timeline and cost."
    };
    
    console.log('📤 Test Data:');
    console.log(JSON.stringify(testData, null, 2));
    console.log('');
    
    try {
        console.log('🚀 Sending request to API...');
        
        // Import the handler function
        const handler = require('./api/contact.js').default;
        
        // Mock request and response objects
        const mockReq = {
            method: 'POST',
            body: testData
        };
        
        const mockRes = {
            headers: {},
            statusCode: 200,
            responseData: null,
            
            setHeader(key, value) {
                this.headers[key] = value;
            },
            
            status(code) {
                this.statusCode = code;
                return this;
            },
            
            json(data) {
                this.responseData = data;
                return this;
            },
            
            end() {
                return this;
            }
        };
        
        // Call the handler
        await handler(mockReq, mockRes);
        
        console.log('📥 Response Status:', mockRes.statusCode);
        console.log('📄 Response Data:', JSON.stringify(mockRes.responseData, null, 2));
        console.log('🔗 Response Headers:', mockRes.headers);
        
        if (mockRes.statusCode === 200 && mockRes.responseData?.success) {
            console.log('');
            console.log('✅ NEW CONTACT FORM API TEST SUCCESSFUL!');
            console.log('📧 Check your email for the test messages:');
            console.log('  - Admin email: aravind.bandaru@appleinteriors.in');
            console.log('  - Customer email: test@example.com');
            
            if (mockRes.responseData.emailIds) {
                console.log('📨 Email IDs:');
                console.log('  - Admin:', mockRes.responseData.emailIds.admin);
                console.log('  - Customer:', mockRes.responseData.emailIds.customer);
            }
        } else {
            console.log('');
            console.log('❌ NEW CONTACT FORM API TEST FAILED');
            console.log('Error:', mockRes.responseData?.error || 'Unknown error');
            
            if (mockRes.responseData?.details) {
                console.log('Details:', mockRes.responseData.details);
            }
            
            if (mockRes.responseData?.fallback) {
                console.log('Fallback options available:', mockRes.responseData.fallback);
            }
        }
        
    } catch (error) {
        console.error('❌ Error testing new contact API:', error.message);
        console.error('Stack:', error.stack);
        
        console.log('');
        console.log('💡 Troubleshooting:');
        console.log('1. Make sure the .env file exists with RESEND_API_KEY');
        console.log('2. Check that the Resend API key is valid');
        console.log('3. Verify the api/contact.js file exists and is properly formatted');
        console.log('4. Ensure all required dependencies are installed');
    }
}

// Test validation functions
function testValidation() {
    console.log('');
    console.log('🔍 Testing Validation Functions...');
    
    const testCases = [
        { fullName: '', emailAddress: 'test@example.com', phoneNumber: '+919876543210', expected: false },
        { fullName: 'A', emailAddress: 'test@example.com', phoneNumber: '+919876543210', expected: false },
        { fullName: 'Test User', emailAddress: 'invalid-email', phoneNumber: '+919876543210', expected: false },
        { fullName: 'Test User', emailAddress: 'test@example.com', phoneNumber: '123', expected: false },
        { fullName: 'Test User', emailAddress: 'test@example.com', phoneNumber: '+919876543210', expected: true },
    ];
    
    testCases.forEach((testCase, index) => {
        const errors = [];
        
        if (!testCase.fullName || testCase.fullName.trim().length < 2) {
            errors.push('Full name is required and must be at least 2 characters');
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!testCase.emailAddress || !emailRegex.test(testCase.emailAddress)) {
            errors.push('Valid email address is required');
        }
        
        const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/;
        const cleanPhone = testCase.phoneNumber.replace(/[\s\-\(\)]/g, '');
        if (!testCase.phoneNumber || !phoneRegex.test(cleanPhone)) {
            errors.push('Valid phone number is required');
        }
        
        const isValid = errors.length === 0;
        const result = isValid === testCase.expected ? '✅' : '❌';
        
        console.log(`${result} Test ${index + 1}: ${isValid ? 'Valid' : 'Invalid'} (Expected: ${testCase.expected ? 'Valid' : 'Invalid'})`);
        if (errors.length > 0) {
            console.log(`   Errors: ${errors.join(', ')}`);
        }
    });
}

// Run tests
async function runAllTests() {
    console.log('🎯 NEW CONTACT FORM TESTING SUITE');
    console.log('================================');
    console.log('');
    
    // Test validation
    testValidation();
    
    // Test API
    await testNewContactAPI();
    
    console.log('');
    console.log('🏁 Testing Complete!');
}

runAllTests();
