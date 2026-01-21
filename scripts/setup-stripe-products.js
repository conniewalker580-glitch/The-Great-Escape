#!/usr/bin/env node

/**
 * Stripe Product Setup Script
 * Automatically creates all subscription products for The Great Escape
 * 
 * Usage:
 *   node scripts/setup-stripe-products.js
 * 
 * Or via npm:
 *   npm run stripe:setup
 */

const Stripe = require('stripe');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Product configurations
const PRODUCTS = [
    {
        name: 'Explorer',
        description: 'Perfect for casual players - 10 escape rooms per month',
        price: 699, // $6.99 in cents
        rooms: 10,
        tier: 'explorer',
        features: [
            '10 rooms per month',
            'AI-powered hints',
            'Progress tracking',
            'Badge collection'
        ]
    },
    {
        name: 'Adventurer',
        description: 'For dedicated escape room enthusiasts - 100 rooms per month',
        price: 1299, // $12.99 in cents
        rooms: 100,
        tier: 'adventurer',
        features: [
            '100 rooms per month',
            'AI-powered hints',
            'Progress tracking',
            'Badge collection',
            'Priority support'
        ]
    },
    {
        name: 'Elite',
        description: 'For serious players - 200 rooms per month',
        price: 1999, // $19.99 in cents
        rooms: 200,
        tier: 'elite',
        features: [
            '200 rooms per month',
            'AI-powered hints',
            'Progress tracking',
            'Badge collection',
            'Priority support',
            'Early access to new rooms'
        ]
    },
    {
        name: 'Master Escape',
        description: 'Ultimate escape room experience - unlimited rooms',
        price: 2999, // $29.99 in cents
        rooms: 'unlimited',
        tier: 'master',
        features: [
            'Unlimited rooms',
            'AI-powered hints',
            'Progress tracking',
            'Badge collection',
            'Priority support',
            'Early access to new rooms',
            'Exclusive master badge'
        ]
    }
];

async function createProducts() {
    console.log('🎯 The Great Escape - Stripe Product Setup\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (!process.env.STRIPE_SECRET_KEY) {
        console.error('❌ Error: STRIPE_SECRET_KEY not found in .env.local');
        console.error('   Please add your Stripe secret key to .env.local\n');
        process.exit(1);
    }

    const results = [];

    for (const productConfig of PRODUCTS) {
        try {
            console.log(`📦 Creating product: ${productConfig.name}...`);

            // Create product
            const product = await stripe.products.create({
                name: `The Great Escape - ${productConfig.name}`,
                description: productConfig.description,
                metadata: {
                    tier: productConfig.tier,
                    rooms: productConfig.rooms.toString(),
                    app: 'the-great-escape'
                }
            });

            console.log(`   ✅ Product created: ${product.id}`);

            // Create price
            const price = await stripe.prices.create({
                product: product.id,
                unit_amount: productConfig.price,
                currency: 'usd',
                recurring: {
                    interval: 'month'
                },
                metadata: {
                    tier: productConfig.tier,
                    rooms: productConfig.rooms.toString()
                }
            });

            console.log(`   ✅ Price created: ${price.id}`);
            console.log(`   💰 Price: $${(productConfig.price / 100).toFixed(2)}/month`);
            console.log(`   🎮 Rooms: ${productConfig.rooms}\n`);

            results.push({
                tier: productConfig.tier,
                productId: product.id,
                priceId: price.id,
                price: productConfig.price,
                rooms: productConfig.rooms
            });

        } catch (error) {
            console.error(`   ❌ Error creating ${productConfig.name}:`, error.message);
            console.error('');
        }
    }

    // Generate environment variables
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📝 Environment Variables\n');
    console.log('Add these to your .env.local file:\n');

    const envVars = [];
    results.forEach(result => {
        const envVar = `NEXT_PUBLIC_STRIPE_PRICE_${result.tier.toUpperCase()}=${result.priceId}`;
        envVars.push(envVar);
        console.log(envVar);
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Update .env.local file
    try {
        const envPath = path.join(process.cwd(), '.env.local');
        let envContent = fs.readFileSync(envPath, 'utf8');

        // Update or add price IDs
        results.forEach(result => {
            const key = `NEXT_PUBLIC_STRIPE_PRICE_${result.tier.toUpperCase()}`;
            const regex = new RegExp(`${key}=.*`, 'g');
            const newLine = `${key}=${result.priceId}`;

            if (envContent.match(regex)) {
                envContent = envContent.replace(regex, newLine);
            } else {
                envContent += `\n${newLine}`;
            }
        });

        fs.writeFileSync(envPath, envContent);
        console.log('✅ Updated .env.local with new Price IDs\n');
    } catch (error) {
        console.error('⚠️  Could not update .env.local automatically');
        console.error('   Please add the environment variables manually\n');
    }

    // Save results to JSON
    const resultsPath = path.join(process.cwd(), 'stripe-products.json');
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    console.log(`✅ Saved product details to stripe-products.json\n`);

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📊 Summary\n');
    console.log(`   Products created: ${results.length}/4`);
    console.log(`   Total setup: $${(results.reduce((sum, r) => sum + r.price, 0) / 100).toFixed(2)}/month (all tiers)\n`);

    console.log('🎉 Stripe products setup complete!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📋 Next Steps:\n');
    console.log('1. ✅ Products created in Stripe');
    console.log('2. ✅ Price IDs added to .env.local');
    console.log('3. 🔄 Set up webhook (run: npm run stripe:webhook)');
    console.log('4. 🧪 Test checkout flow');
    console.log('5. 🚀 Deploy to production\n');

    console.log('💡 View products: https://dashboard.stripe.com/products\n');

    return results;
}

// Run the setup
createProducts()
    .then(() => {
        console.log('✨ All done!\n');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Fatal error:', error.message);
        console.error('\n🔧 Troubleshooting:');
        console.error('   1. Check your STRIPE_SECRET_KEY in .env.local');
        console.error('   2. Ensure you have internet connection');
        console.error('   3. Verify Stripe account is active\n');
        process.exit(1);
    });
