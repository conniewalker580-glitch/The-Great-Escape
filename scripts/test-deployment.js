#!/usr/bin/env node

/**
 * Automated Testing Script for The Great Escape
 * Tests all critical functionality before and after deployment
 * 
 * Usage: node scripts/test-deployment.js <production-url>
 * Example: node scripts/test-deployment.js https://the-great-escape.vercel.app
 */

const https = require('https');
const http = require('http');

const PRODUCTION_URL = process.argv[2] || 'http://localhost:3000';

console.log('🧪 The Great Escape - Deployment Testing\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log(`Testing URL: ${PRODUCTION_URL}\n`);

let passedTests = 0;
let failedTests = 0;
let totalTests = 0;

function testPassed(name) {
    passedTests++;
    totalTests++;
    console.log(`✅ ${name}`);
}

function testFailed(name, error) {
    failedTests++;
    totalTests++;
    console.log(`❌ ${name}`);
    if (error) console.log(`   Error: ${error}\n`);
}

async function makeRequest(path) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, PRODUCTION_URL);
        const client = url.protocol === 'https:' ? https : http;

        client.get(url.toString(), (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
        }).on('error', reject);
    });
}

async function runTests() {
    console.log('📋 Running Tests...\n');

    // Test 1: Homepage
    console.log('1️⃣  Testing Homepage...');
    try {
        const res = await makeRequest('/');
        if (res.status === 200 && res.data.includes('The Great Escape')) {
            testPassed('Homepage loads correctly');
        } else {
            testFailed('Homepage load', `Status: ${res.status}`);
        }
    } catch (error) {
        testFailed('Homepage load', error.message);
    }

    // Test 2: Pricing Page
    console.log('\n2️⃣  Testing Pricing Page...');
    try {
        const res = await makeRequest('/pricing');
        if (res.status === 200) {
            const hasExplorer = res.data.includes('Explorer') || res.data.includes('6.99');
            const hasAdventurer = res.data.includes('Adventurer') || res.data.includes('12.99');
            const hasMaster = res.data.includes('Master') || res.data.includes('29.99');

            if (hasExplorer && hasAdventurer && hasMaster) {
                testPassed('Pricing page shows all tiers');
            } else {
                testFailed('Pricing page tiers', 'Not all tiers visible');
            }
        } else {
            testFailed('Pricing page load', `Status: ${res.status}`);
        }
    } catch (error) {
        testFailed('Pricing page load', error.message);
    }

    // Test 3: API Routes
    console.log('\n3️⃣  Testing API Routes...');

    const apiRoutes = [
        '/api/user-progress',
        '/api/checkout',
        '/api/webhooks/stripe',
        '/api/ai/hint',
        '/api/play/track'
    ];

    for (const route of apiRoutes) {
        try {
            const res = await makeRequest(route);
            // API routes should return 401 (unauthorized) or 405 (method not allowed) for GET
            if (res.status === 401 || res.status === 405 || res.status === 200) {
                testPassed(`API route exists: ${route}`);
            } else {
                testFailed(`API route: ${route}`, `Unexpected status: ${res.status}`);
            }
        } catch (error) {
            testFailed(`API route: ${route}`, error.message);
        }
    }

    // Test 4: Static Pages
    console.log('\n4️⃣  Testing Static Pages...');

    const staticPages = [
        '/dashboard',
        '/rewards',
        '/accessibility'
    ];

    for (const page of staticPages) {
        try {
            const res = await makeRequest(page);
            if (res.status === 200 || res.status === 307) { // 307 = redirect (auth required)
                testPassed(`Page accessible: ${page}`);
            } else {
                testFailed(`Page: ${page}`, `Status: ${res.status}`);
            }
        } catch (error) {
            testFailed(`Page: ${page}`, error.message);
        }
    }

    // Test 5: Room Pages (Sample)
    console.log('\n5️⃣  Testing Room Pages...');

    const sampleRooms = ['room-1', 'room-50', 'room-100'];

    for (const roomId of sampleRooms) {
        try {
            const res = await makeRequest(`/play/${roomId}`);
            if (res.status === 200 || res.status === 307) {
                testPassed(`Room accessible: ${roomId}`);
            } else {
                testFailed(`Room: ${roomId}`, `Status: ${res.status}`);
            }
        } catch (error) {
            testFailed(`Room: ${roomId}`, error.message);
        }
    }

    // Test 6: Security Headers
    console.log('\n6️⃣  Testing Security Headers...');
    try {
        const res = await makeRequest('/');
        const headers = res.headers;

        if (headers['x-frame-options'] || headers['content-security-policy']) {
            testPassed('Security headers present');
        } else {
            console.log('⚠️  Security headers not detected (may be added by Vercel)');
        }
    } catch (error) {
        testFailed('Security headers', error.message);
    }

    // Test 7: Performance Check
    console.log('\n7️⃣  Testing Performance...');
    try {
        const start = Date.now();
        await makeRequest('/');
        const loadTime = Date.now() - start;

        if (loadTime < 3000) {
            testPassed(`Homepage loads in ${loadTime}ms (< 3s)`);
        } else {
            console.log(`⚠️  Homepage loads in ${loadTime}ms (> 3s - could be improved)`);
        }
    } catch (error) {
        testFailed('Performance check', error.message);
    }

    // Summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📊 Test Summary\n');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);

    if (failedTests === 0) {
        console.log('🎉 All tests passed! Deployment is successful!\n');
        console.log('✅ Ready for production use\n');
    } else {
        console.log('⚠️  Some tests failed. Please review and fix issues.\n');
        console.log('💡 Common issues:');
        console.log('   - Check environment variables are set');
        console.log('   - Verify database is initialized');
        console.log('   - Ensure all dependencies are installed\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Manual Testing Checklist
    console.log('📋 Manual Testing Checklist\n');
    console.log('Please manually verify these items:\n');
    console.log('Authentication:');
    console.log('  [ ] Sign up works');
    console.log('  [ ] Sign in works');
    console.log('  [ ] Sessions persist\n');

    console.log('Subscriptions:');
    console.log('  [ ] Checkout redirects to Stripe');
    console.log('  [ ] Test payment works (4242 4242 4242 4242)');
    console.log('  [ ] Webhook updates database');
    console.log('  [ ] User tier changes after payment\n');

    console.log('Rooms:');
    console.log('  [ ] VR360 panoramic view loads');
    console.log('  [ ] Hotspots are clickable');
    console.log('  [ ] Hotspot descriptions appear');
    console.log('  [ ] Puzzles accept correct answers');
    console.log('  [ ] Success effects trigger (confetti, balloons)');
    console.log('  [ ] Progress saves to database');
    console.log('  [ ] Hints work');
    console.log('  [ ] Badges award automatically\n');

    console.log('Mobile:');
    console.log('  [ ] Responsive layout');
    console.log('  [ ] Touch-friendly hotspots');
    console.log('  [ ] Readable text');
    console.log('  [ ] Mobile keyboard works for puzzles\n');

    console.log('Database:');
    console.log('  [ ] Users table populated');
    console.log('  [ ] Room progress saves');
    console.log('  [ ] Subscriptions recorded');
    console.log('  [ ] Badges awarded\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(failedTests > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
