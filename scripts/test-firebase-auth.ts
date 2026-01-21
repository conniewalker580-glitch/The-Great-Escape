import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables FIRST
config({ path: resolve(process.cwd(), '.env.local') });

import { initializeApp, getApps } from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    deleteUser
} from 'firebase/auth';

async function testFirebaseAuth() {
    console.log('🔥 Testing Firebase Authentication...\n');

    // Verify environment variables are loaded
    console.log('🔍 Checking Firebase configuration...');
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
    const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

    if (!apiKey || !projectId || !authDomain) {
        console.error('❌ Firebase environment variables not found!');
        console.error('   Make sure .env.local contains all required Firebase variables');
        process.exit(1);
    }

    console.log(`✅ Firebase Project ID: ${projectId}`);
    console.log(`✅ Auth Domain: ${authDomain}`);
    console.log(`✅ API Key: ${apiKey.substring(0, 10)}...`);
    console.log('');

    // Initialize Firebase
    const firebaseConfig = {
        apiKey,
        authDomain,
        projectId,
        storageBucket,
        messagingSenderId,
        appId,
    };

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const auth = getAuth(app);

    console.log('✅ Firebase initialized successfully!');
    console.log('');

    // Generate random test credentials
    const timestamp = Date.now();
    const testEmail = `test-user-${timestamp}@example.com`;
    const testPassword = 'TestPassword123!';

    try {
        // ========== TEST 1: Sign Up ==========
        console.log('📝 Test 1: Creating new user account...');
        console.log(`   Email: ${testEmail}`);

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            testEmail,
            testPassword
        );

        const user = userCredential.user;
        console.log('✅ Sign up successful!');
        console.log(`   User ID: ${user.uid}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Email Verified: ${user.emailVerified}`);
        console.log('');

        // ========== TEST 2: Sign Out ==========
        console.log('🚪 Test 2: Signing out...');
        await signOut(auth);
        console.log('✅ Sign out successful!');
        console.log('');

        // ========== TEST 3: Sign In ==========
        console.log('🔐 Test 3: Signing in with existing credentials...');
        const signInCredential = await signInWithEmailAndPassword(
            auth,
            testEmail,
            testPassword
        );

        const signedInUser = signInCredential.user;
        console.log('✅ Sign in successful!');
        console.log(`   User ID: ${signedInUser.uid}`);
        console.log(`   Email: ${signedInUser.email}`);
        console.log('');

        // ========== TEST 4: Verify Auth State ==========
        console.log('🔍 Test 4: Verifying current auth state...');
        const currentUser = auth.currentUser;
        if (currentUser) {
            console.log('✅ User is authenticated!');
            console.log(`   Current User ID: ${currentUser.uid}`);
            console.log(`   Current User Email: ${currentUser.email}`);
        } else {
            console.log('❌ No user is currently authenticated');
        }
        console.log('');

        // ========== CLEANUP: Delete Test User ==========
        console.log('🧹 Cleanup: Deleting test user...');
        if (auth.currentUser) {
            await deleteUser(auth.currentUser);
            console.log('✅ Test user deleted successfully!');
        }
        console.log('');

        // ========== SUMMARY ==========
        console.log('═══════════════════════════════════════');
        console.log('🎉 ALL TESTS PASSED!');
        console.log('═══════════════════════════════════════');
        console.log('✅ User sign up works correctly');
        console.log('✅ User sign out works correctly');
        console.log('✅ User sign in works correctly');
        console.log('✅ Auth state is properly maintained');
        console.log('');
        console.log('Firebase Authentication is fully functional! 🚀');

    } catch (error: any) {
        console.error('');
        console.error('═══════════════════════════════════════');
        console.error('❌ TEST FAILED!');
        console.error('═══════════════════════════════════════');
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        console.error('');

        // Provide helpful error messages
        if (error.code === 'auth/configuration-not-found' || error.code === 'auth/invalid-api-key') {
            console.error('💡 Solution: Make sure your Firebase project is configured with Email/Password authentication.');
            console.error('   1. Go to Firebase Console > Authentication > Sign-in method');
            console.error('   2. Enable "Email/Password" provider');
            console.error('   3. Verify your API key in .env.local is correct');
        } else if (error.code === 'auth/network-request-failed') {
            console.error('💡 Solution: Check your internet connection and Firebase project settings.');
        } else if (error.code === 'auth/operation-not-allowed') {
            console.error('💡 Solution: Email/Password authentication is not enabled in Firebase Console.');
            console.error('   Go to: https://console.firebase.google.com/project/the-great-escape-8fc89/authentication/providers');
            console.error('   Enable "Email/Password" sign-in method');
        }

        // Try to cleanup even if test failed
        try {
            if (auth.currentUser) {
                await deleteUser(auth.currentUser);
                console.log('🧹 Test user cleaned up');
            }
        } catch (cleanupError) {
            // Ignore cleanup errors
        }

        process.exit(1);
    }
}

// Run the test
testFirebaseAuth();
