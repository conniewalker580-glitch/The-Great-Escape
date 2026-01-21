#!/usr/bin/env node

/**
 * Stripe Webhook Setup Script
 * Automatically configures webhook endpoint for The Great Escape
 * 
 * Usage:
 *   node scripts/setup-stripe-webhook.js <your-app-url>
 * 
 * Example:
 *   node scripts/setup-stripe-webhook.js https://the-great-escape.vercel.app
 * 
 * Or via npm:
 *   npm run stripe:webhook -- https://the-great-escape.vercel.app
 */

const Stripe = require('stripe');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Events to listen for
const WEBHOOK_EVENTS = [
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'invoice.payment_succeeded',
    'invoice.payment_failed'
];

async function setupWebhook(appUrl) {
    console.log('🔗 The Great Escape - Stripe Webhook Setup\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (!process.env.STRIPE_SECRET_KEY) {
        console.error('❌ Error: STRIPE_SECRET_KEY not found in .env.local');
        process.exit(1);
    }

    if (!appUrl) {
        console.error('❌ Error: App URL required');
        console.error('\nUsage:');
        console.error('  node scripts/setup-stripe-webhook.js <your-app-url>');
        console.error('\nExample:');
        console.error('  node scripts/setup-stripe-webhook.js https://the-great-escape.vercel.app\n');
        process.exit(1);
    }

    // Ensure URL ends without trailing slash
    const baseUrl = appUrl.replace(/\/$/, '');
    const webhookUrl = `${baseUrl}/api/webhooks/stripe`;

    console.log(`📍 Webhook URL: ${webhookUrl}\n`);

    try {
        // Check for existing webhooks
        console.log('🔍 Checking for existing webhooks...');
        const existingWebhooks = await stripe.webhookEndpoints.list();

        const existingWebhook = existingWebhooks.data.find(
            wh => wh.url === webhookUrl
        );

        if (existingWebhook) {
            console.log('⚠️  Webhook already exists!');
            console.log(`   ID: ${existingWebhook.id}`);
            console.log(`   Status: ${existingWebhook.status}`);
            console.log('\n❓ Do you want to:');
            console.log('   1. Keep existing webhook');
            console.log('   2. Delete and recreate\n');
            console.log('💡 To recreate, delete the webhook in Stripe Dashboard first.\n');

            // Update .env.local with existing secret
            updateEnvFile(existingWebhook.secret);

            return existingWebhook;
        }

        // Create new webhook
        console.log('📝 Creating webhook endpoint...');

        const webhook = await stripe.webhookEndpoints.create({
            url: webhookUrl,
            enabled_events: WEBHOOK_EVENTS,
            description: 'The Great Escape - Subscription Events',
            metadata: {
                app: 'the-great-escape',
                environment: baseUrl.includes('localhost') ? 'development' : 'production'
            }
        });

        console.log('✅ Webhook created successfully!\n');
        console.log(`   ID: ${webhook.id}`);
        console.log(`   URL: ${webhook.url}`);
        console.log(`   Status: ${webhook.status}\n`);

        console.log('📋 Listening for events:');
        WEBHOOK_EVENTS.forEach(event => {
            console.log(`   • ${event}`);
        });
        console.log('');

        // Update .env.local
        updateEnvFile(webhook.secret);

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('🎉 Webhook setup complete!\n');
        console.log('📋 Next Steps:\n');
        console.log('1. ✅ Webhook endpoint created');
        console.log('2. ✅ Webhook secret added to .env.local');
        console.log('3. 🧪 Test webhook (run: npm run stripe:test-webhook)');
        console.log('4. 🚀 Deploy to production\n');

        console.log('💡 View webhook: https://dashboard.stripe.com/webhooks\n');

        // Save webhook details
        const webhookPath = path.join(process.cwd(), 'stripe-webhook.json');
        fs.writeFileSync(webhookPath, JSON.stringify({
            id: webhook.id,
            url: webhook.url,
            secret: webhook.secret,
            events: WEBHOOK_EVENTS,
            created: new Date().toISOString()
        }, null, 2));

        console.log('✅ Saved webhook details to stripe-webhook.json\n');

        return webhook;

    } catch (error) {
        console.error('\n❌ Error creating webhook:', error.message);
        console.error('\n🔧 Troubleshooting:');
        console.error('   1. Ensure your app is deployed and accessible');
        console.error('   2. Check STRIPE_SECRET_KEY is correct');
        console.error('   3. Verify the URL is publicly accessible');
        console.error('   4. Check Stripe Dashboard for existing webhooks\n');
        process.exit(1);
    }
}

function updateEnvFile(webhookSecret) {
    try {
        const envPath = path.join(process.cwd(), '.env.local');
        let envContent = fs.readFileSync(envPath, 'utf8');

        const key = 'STRIPE_WEBHOOK_SECRET';
        const regex = new RegExp(`${key}=.*`, 'g');
        const newLine = `${key}=${webhookSecret}`;

        if (envContent.match(regex)) {
            envContent = envContent.replace(regex, newLine);
        } else {
            envContent += `\n${newLine}`;
        }

        fs.writeFileSync(envPath, envContent);
        console.log('✅ Updated .env.local with webhook secret\n');
        console.log(`   ${key}=${webhookSecret.substring(0, 20)}...\n`);
    } catch (error) {
        console.error('⚠️  Could not update .env.local automatically');
        console.error(`   Please add manually: STRIPE_WEBHOOK_SECRET=${webhookSecret}\n`);
    }
}

// Get app URL from command line
const appUrl = process.argv[2];

// Run the setup
setupWebhook(appUrl)
    .then(() => {
        console.log('✨ All done!\n');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Fatal error:', error.message);
        process.exit(1);
    });
