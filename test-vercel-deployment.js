const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testVercelDeployment() {
    console.log('🧪 Testing Vercel API Deployment...');
    
    const baseUrl = 'https://appleinteriors.in';
    const testEndpoints = [
        '/api/hello',
        '/api/test', 
        '/api/contact'
    ];
    
    for (const endpoint of testEndpoints) {
        const url = `${baseUrl}${endpoint}`;
        console.log(`\n🌐 Testing: ${url}`);
        
        try {
            // Test GET request first
            const getResponse = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            console.log(`📥 GET Response Status: ${getResponse.status}`);
            
            if (getResponse.ok) {
                const getResult = await getResponse.text();
                console.log(`✅ GET Success: ${getResult.substring(0, 100)}...`);
            } else {
                console.log(`❌ GET Failed: ${getResponse.statusText}`);
                const errorText = await getResponse.text();
                console.log(`📄 Error Response: ${errorText.substring(0, 100)}...`);
            }
            
            // Test POST request for contact endpoint
            if (endpoint === '/api/contact') {
                console.log(`\n📤 Testing POST to ${url}`);
                
                const testData = {
                    fullName: "Test User",
                    emailAddress: "test@example.com",
                    phoneNumber: "+91 9876543210",
                    propertyType: "Villa",
                    projectLocation: "Hyderabad",
                    budget: "₹10-15 Lakhs",
                    projectMessage: "Test message"
                };
                
                const postResponse = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(testData)
                });
                
                console.log(`📥 POST Response Status: ${postResponse.status}`);
                
                const postResult = await postResponse.text();
                console.log(`📥 POST Response: ${postResult.substring(0, 200)}...`);
            }
            
        } catch (error) {
            console.error(`❌ Error testing ${endpoint}:`, error.message);
        }
    }
}

testVercelDeployment();
