#!/usr/bin/env node

/**
 * Stripe Webhook Test Script
 * Tests webhook endpoint by sending test events
 * 
 * Usage:
 *   node scripts/test-stripe-webhook.js
 * 
 * Or via npm:
 *   npm run stripe:test-webhook
 */

const Stripe = require('stripe');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function testWebhook() {
    console.log('🧪 The Great Escape - Webhook Test\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (!process.env.STRIPE_SECRET_KEY) {
        console.error('❌ Error: STRIPE_SECRET_KEY not found in .env.local');
        process.exit(1);
    }

    try {
        // List webhooks
        console.log('🔍 Finding webhook endpoints...');
        const webhooks = await stripe.webhookEndpoints.list();

        if (webhooks.data.length === 0) {
            console.error('❌ No webhooks found!');
            console.error('   Run: npm run stripe:webhook -- <your-app-url>\n');
            process.exit(1);
        }

        console.log(`✅ Found ${webhooks.data.length} webhook(s)\n`);

        webhooks.data.forEach((webhook, index) => {
            console.log(`${index + 1}. ${webhook.url}`);
            console.log(`   ID: ${webhook.id}`);
            console.log(`   Status: ${webhook.status}`);
            console.log(`   Events: ${webhook.enabled_events.length}`);
            console.log('');
        });

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('🧪 Testing webhook with sample events...\n');

        // Test events
        const testEvents = [
            'checkout.session.completed',
            'customer.subscription.updated',
            'invoice.payment_succeeded'
        ];

        for (const eventType of testEvents) {
            try {
                console.log(`📤 Sending test event: ${eventType}...`);
                
                // Trigger test event in Stripe
                const event = await stripe.events.create({
                    type: eventType,
                    data: {
                        object: {}
                    }
                });

                console.log(`   ✅ Event sent: ${event.id}\n`);
            } catch (error) {
                console.log(`   ⚠️  Could not send test event: ${error.message}\n`);
            }
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('📋 Manual Testing:\n');
        console.log('1. Go to: https://dashboard.stripe.com/webhooks');
        console.log('2. Click on your webhook');
        console.log('3. Click "Send test webhook"');
        console.log('4. Select an event type');
        console.log('5. Click "Send test webhook"\n');

        console.log('💡 Check your app logs to see if events are received\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run the test
testWebhook()
    .then(() => {
        console.log('✨ Test complete!\n');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Fatal error:', error.message);
        process.exit(1);
    });
