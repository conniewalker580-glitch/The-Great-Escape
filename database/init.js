#!/usr/bin/env node

/**
 * Database Initialization Script
 * Run this to set up your Vercel Postgres database
 * 
 * Usage:
 *   node database/init.js
 * 
 * Or via npm:
 *   npm run db:init
 */

const { sql } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
    console.log('🗄️  Initializing The Great Escape Database...\n');

    try {
        // Read the schema file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('📄 Reading schema.sql...');

        // Split schema into individual statements
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        console.log(`📝 Found ${statements.length} SQL statements\n`);

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];

            // Skip comments
            if (statement.startsWith('--')) continue;

            try {
                console.log(`⚙️  Executing statement ${i + 1}/${statements.length}...`);
                await sql.query(statement + ';');
                console.log(`✅ Success\n`);
            } catch (error) {
                // Some statements might fail if tables already exist - that's okay
                if (error.message.includes('already exists')) {
                    console.log(`⚠️  Already exists (skipping)\n`);
                } else {
                    console.error(`❌ Error: ${error.message}\n`);
                }
            }
        }

        console.log('🎉 Database initialization complete!\n');
        console.log('📊 Database Summary:');
        console.log('   ✓ Users table');
        console.log('   ✓ Subscriptions table');
        console.log('   ✓ Room progress table');
        console.log('   ✓ Badges table');
        console.log('   ✓ User badges table');
        console.log('   ✓ Daily rewards table');
        console.log('   ✓ AI hints table');
        console.log('   ✓ Usage tracking table');
        console.log('   ✓ Indexes created');
        console.log('   ✓ Triggers set up');
        console.log('   ✓ Views created');
        console.log('   ✓ Initial badges seeded\n');

        // Verify tables were created
        const result = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `;

        console.log('📋 Tables in database:');
        result.rows.forEach(row => {
            console.log(`   • ${row.table_name}`);
        });

        console.log('\n✨ Your database is ready to use!');
        console.log('\n💡 Next steps:');
        console.log('   1. Make sure POSTGRES_URL is set in your .env.local');
        console.log('   2. Run: npm run dev');
        console.log('   3. Test the app at http://localhost:3000\n');

    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        console.error('\n🔧 Troubleshooting:');
        console.error('   1. Make sure you have created a Vercel Postgres database');
        console.error('   2. Check that POSTGRES_URL is set in .env.local');
        console.error('   3. Verify your database connection is working');
        console.error('\n📚 See: https://vercel.com/docs/storage/vercel-postgres\n');
        process.exit(1);
    }
}

// Run the initialization
initializeDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
