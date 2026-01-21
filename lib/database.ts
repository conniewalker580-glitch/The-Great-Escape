import { db } from '@/lib/firebase';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    orderBy,
    limit,
    serverTimestamp,
    increment,
    addDoc
} from 'firebase/firestore';

// ============================================
// USER OPERATIONS
// ============================================

export async function createUser(userId: string, email: string, username?: string) {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            await updateDoc(userRef, {
                email,
                username: username || userSnap.data().username,
                updated_at: serverTimestamp()
            });
            return { id: userId, ...userSnap.data(), email };
        }

        const userData = {
            id: userId,
            email,
            username: username || null,
            tier: 'free',
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            rooms_played_this_month: 0,
            total_rooms_completed: 0,
            total_hints_used: 0,
            total_play_time_seconds: 0
        };

        await setDoc(userRef, userData);
        return userData;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

export async function getUser(userId: string) {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        return userSnap.exists() ? { id: userId, ...userSnap.data() } : null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}

export async function updateUserTier(userId: string, tier: string) {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            tier,
            updated_at: serverTimestamp()
        });
        return { id: userId, tier };
    } catch (error) {
        console.error('Error updating user tier:', error);
        throw error;
    }
}

export async function incrementRoomsPlayed(userId: string) {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            rooms_played_this_month: increment(1),
            total_rooms_completed: increment(1),
            updated_at: serverTimestamp()
        });
        const snap = await getDoc(userRef);
        return snap.data();
    } catch (error) {
        console.error('Error incrementing rooms played:', error);
        throw error;
    }
}

export async function resetMonthlyUsage() {
    console.warn('resetMonthlyUsage called - implemented as no-op for client SDK.');
    return true;
}

// ============================================
// SUBSCRIPTION OPERATIONS
// ============================================

export async function createSubscription(data: {
    userId: string;
    tier: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    stripePriceId: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
}) {
    try {
        const subRef = doc(db, 'subscriptions', data.stripeSubscriptionId);

        const subData = {
            user_id: data.userId,
            tier: data.tier,
            stripe_customer_id: data.stripeCustomerId,
            stripe_subscription_id: data.stripeSubscriptionId,
            stripe_price_id: data.stripePriceId,
            status: 'active',
            current_period_start: data.currentPeriodStart,
            current_period_end: data.currentPeriodEnd,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
        };

        await setDoc(subRef, subData);
        await updateUserTier(data.userId, data.tier);
        return subData;
    } catch (error) {
        console.error('Error creating subscription:', error);
        throw error;
    }
}

export async function getSubscription(userId: string) {
    try {
        const q = query(
            collection(db, 'subscriptions'),
            where('user_id', '==', userId),
            where('status', '==', 'active'),
            orderBy('created_at', 'desc'),
            limit(1)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        return snapshot.docs[0].data();
    } catch (error) {
        console.error('Error getting subscription:', error);
        return null;
    }
}

export async function updateSubscriptionStatus(stripeSubscriptionId: string, status: string) {
    try {
        const subRef = doc(db, 'subscriptions', stripeSubscriptionId);
        const subSnap = await getDoc(subRef);

        if (!subSnap.exists()) return null;

        await updateDoc(subRef, {
            status,
            updated_at: serverTimestamp()
        });

        const data = subSnap.data();
        if (status === 'canceled' && data.user_id) {
            await updateUserTier(data.user_id, 'free');
        }

        return { ...data, status };
    } catch (error) {
        console.error('Error updating subscription status:', error);
        throw error;
    }
}

// ============================================
// ROOM PROGRESS OPERATIONS
// ============================================

export async function saveRoomProgress(data: {
    userId: string;
    roomId: string;
    completed: boolean;
    stars: number;
    rank: string;
    timeSeconds: number;
    hintsUsed: number;
}) {
    try {
        const progressRef = doc(db, 'users', data.userId, 'room_progress', data.roomId);
        const progressSnap = await getDoc(progressRef);

        let finalStars = data.stars;
        let attempts = 1;

        if (progressSnap.exists()) {
            const current = progressSnap.data();
            finalStars = Math.max(current.stars || 0, data.stars);
            attempts = (current.attempts || 0) + 1;
        }

        const updateData = {
            user_id: data.userId,
            room_id: data.roomId,
            completed: data.completed,
            stars: finalStars,
            rank: data.rank,
            time_seconds: data.timeSeconds,
            hints_used: data.hintsUsed,
            attempts: attempts,
            last_played_at: serverTimestamp(),
        };

        if (!progressSnap.exists()) {
            Object.assign(updateData, { first_completed_at: serverTimestamp() });
        }

        await setDoc(progressRef, updateData, { merge: true });

        if (data.completed) {
            const userRef = doc(db, 'users', data.userId);
            await updateDoc(userRef, {
                total_hints_used: increment(data.hintsUsed),
                total_play_time_seconds: increment(data.timeSeconds)
            });
        }

        return updateData;
    } catch (error) {
        console.error('Error saving room progress:', error);
        throw error;
    }
}

export async function getRoomProgress(userId: string, roomId: string) {
    try {
        const progressRef = doc(db, 'users', userId, 'room_progress', roomId);
        const snap = await getDoc(progressRef);
        return snap.exists() ? snap.data() : null;
    } catch (error) {
        console.error('Error getting room progress:', error);
        return null;
    }
}

export async function getAllUserProgress(userId: string) {
    try {
        const colRef = collection(db, 'users', userId, 'room_progress');
        const snap = await getDocs(colRef);
        return snap.docs.map(d => d.data());
    } catch (error) {
        console.error('Error getting all user progress:', error);
        return [];
    }
}

// ============================================
// BADGE OPERATIONS
// ============================================

export async function awardBadge(userId: string, badgeId: string) {
    try {
        const badgeRef = doc(db, 'users', userId, 'badges', badgeId);
        const snap = await getDoc(badgeRef);

        if (snap.exists()) return null;

        const badgeData = {
            user_id: userId,
            badge_id: badgeId,
            earned_at: serverTimestamp()
        };
        await setDoc(badgeRef, badgeData);
        return badgeData;
    } catch (error) {
        console.error('Error awarding badge:', error);
        return null;
    }
}

export async function getUserBadges(userId: string) {
    try {
        const colRef = collection(db, 'users', userId, 'badges');
        const snap = await getDocs(colRef);
        return snap.docs.map(d => d.data());
    } catch (error) {
        console.error('Error getting user badges:', error);
        return [];
    }
}

// ============================================
// AI HINTS OPERATIONS
// ============================================

export async function saveAIHint(data: {
    userId: string;
    roomId: string;
    puzzleId?: string;
    hintText: string;
}) {
    try {
        const hintData = {
            user_id: data.userId,
            room_id: data.roomId,
            puzzle_id: data.puzzleId || null,
            hint_text: data.hintText,
            created_at: serverTimestamp()
        };
        await addDoc(collection(db, 'ai_hints'), hintData);
        return hintData;
    } catch (error) {
        console.error('Error saving AI hint:', error);
        return null;
    }
}

export async function trackUsage(data: any) {
    try {
        await addDoc(collection(db, 'usage_tracking'), { ...data, timestamp: serverTimestamp() });
    } catch (e) { console.error(e); }
}

export async function getUserStats(userId: string) {
    return getUser(userId);
}

export async function initializeDatabase() {
    console.log('Firebase ready.');
    return true;
}

// Stubbed for now
export async function createDailyReward(uid: string, type: string, val: string) { return null; }
export async function claimDailyReward(uid: string) { return null; }
export async function checkAndAwardBadges(uid: string) { return []; } 

export async function getGeneratedRooms(userId: string) {
    try {
        const q = query(
            collection(db, 'generated_rooms'),
            where('user_id', '==', userId),
            orderBy('created_at', 'desc')
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
        console.error('Error getting generated rooms:', error);
        return [];
    }
}


export async function saveGeneratedRoom(room: any, userId: string) {
    try {
        const docRef = doc(db, 'generated_rooms', room.id);
        const data = { ...room, user_id: userId, created_at: serverTimestamp() };
        await setDoc(docRef, data);
        return data;
    } catch (error) {
        console.error('Error saving generated room:', error);
        throw error;
    }
}

