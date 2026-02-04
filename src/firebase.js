import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';


// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB9wT3HkQGHJ9b1t2B-P3Nt_Is4RYEDaHs",
    authDomain: "the-great-escape-8fc89.firebaseapp.com",
    projectId: "the-great-escape-8fc89",
    storageBucket: "the-great-escape-8fc89.firebasestorage.app",
    messagingSenderId: "581268861906",
    appId: "1:581268861906:web:f0567770af6d2732e90e0b",
    measurementId: "G-S2FRQXGB1B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

// Anonymous authentication
export const signInAnonymousUser = async () => {
    try {
        const userCredential = await signInAnonymously(auth);
        return userCredential.user;
    } catch (error) {
        console.error("Error signing in anonymously:", error);
        return null;
    }
};

// Add a score to the leaderboard
export const addScore = async (nickname, timeInSeconds) => {
    try {
        const docRef = await addDoc(collection(db, "leaderboard"), {
            nickname: nickname || "Anonymous",
            time: timeInSeconds,
            timestamp: new Date().toISOString()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding score:", error);
        return null;
    }
};

// Get top 10 scores from leaderboard
export const getLeaderboard = async () => {
    try {
        const q = query(
            collection(db, "leaderboard"),
            orderBy("time", "asc"),
            limit(10)
        );
        const querySnapshot = await getDocs(q);
        const scores = [];
        querySnapshot.forEach((doc) => {
            scores.push({ id: doc.id, ...doc.data() });
        });
        return scores;
    } catch (error) {
        console.error("Error getting leaderboard:", error);
        return [];
    }
};

export { db, auth };
