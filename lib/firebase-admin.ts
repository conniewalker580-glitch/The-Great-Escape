// Firebase Admin SDK stub for server-side operations
// This is a compatibility layer for existing API routes

import { auth as clientAuth } from './firebase';

// For server-side routes, we'll use the client SDK
// In production, you should use Firebase Admin SDK with service account
export const auth = clientAuth;

// Helper function to get current user info from request
export async function getCurrentUserInfo(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return null;
        }

        const token = authHeader.substring(7);
        // In production, verify the token with Firebase Admin SDK
        // For now, we'll return a basic structure
        return {
            uid: token, // This should be verified token
            email: null,
        };
    } catch (error) {
        console.error('Error getting user info:', error);
        return null;
    }
}

export default auth;
