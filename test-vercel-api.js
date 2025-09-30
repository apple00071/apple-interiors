const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testVercelAPI() {
    console.log('🧪 Testing API on Direct Vercel URL...');
    
    // Test on the latest deployment URL
    const baseUrl = 'https://apple-interiors-hz8dgy5mz-apple00071s-projects.vercel.app';
    const testUrls = [
        `${baseUrl}/api/hello`,
        `${baseUrl}/api/test`,
        `${baseUrl}/api/contact`
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

testVercelAPI();
