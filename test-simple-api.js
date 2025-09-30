const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testSimpleAPI() {
    try {
        console.log('🧪 Testing Simple Test API...');
        console.log('🌐 Testing URL: https://apple-interiors-17yjk2htw-apple00071s-projects.vercel.app/api/test');

        const response = await fetch('https://apple-interiors-17yjk2htw-apple00071s-projects.vercel.app/api/test', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log('📥 Response Status:', response.status);
        console.log('📥 Response Headers:', Object.fromEntries(response.headers.entries()));
        
        const responseText = await response.text();
        console.log('📥 Raw Response:', responseText);
        
        try {
            const result = JSON.parse(responseText);
            console.log('📥 Parsed Response Data:', result);
            
            if (result.success) {
                console.log('✅ Simple Test API is working!');
            } else {
                console.log('❌ Simple Test API failed:', result.error);
            }
        } catch (parseError) {
            console.log('❌ Failed to parse JSON response:', parseError.message);
            console.log('📄 This might be an HTML error page instead of JSON');
        }
        
    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
    }
}

testSimpleAPI();
