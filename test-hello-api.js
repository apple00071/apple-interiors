const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testHelloAPI() {
    console.log('🧪 Testing Hello API on Custom Domain...');
    
    // Test both hello and test endpoints
    const testUrls = [
        'https://appleinteriors.in/api/hello',
        'https://appleinteriors.in/api/test',
        'https://appleinteriors.in/api/contact'
    ];
    
    for (const testUrl of testUrls) {
        console.log('\n🌐 Testing URL:', testUrl);
        
        try {
            const response = await fetch(testUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            console.log('📥 Response Status:', response.status);
            console.log('📥 Response Headers:', Object.fromEntries(response.headers.entries()));
            
            const text = await response.text();
            console.log('📥 Raw Response:', text.substring(0, 200));
            
            if (response.ok) {
                try {
                    const json = JSON.parse(text);
                    console.log('✅ JSON Response:', json);
                } catch (e) {
                    console.log('❌ Not valid JSON');
                }
            } else {
                console.log('❌ Request failed with status:', response.status);
                if (response.headers.get('x-vercel-error')) {
                    console.log('🔍 Vercel Error:', response.headers.get('x-vercel-error'));
                }
            }
            
        } catch (error) {
            console.error('❌ Error:', error.message);
        }
    }
}

testHelloAPI();
