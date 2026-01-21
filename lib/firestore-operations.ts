import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    Timestamp,
    DocumentData,
    QueryConstraint
} from 'firebase/firestore';
import { db } from './firebase';
import {
    User,
    EscapeRoom,
    RoomScene,
    Clue,
    Puzzle,
    UserSession,
    PuzzleAttempt,
    COLLECTIONS
} from './types/firestore';

// Generic helper to convert Firestore doc to typed object
const docToData = <T>(doc: DocumentData): T => {
    return { id: doc.id, ...doc.data() } as T;
};

// ==================== USER OPERATIONS ====================

export const createUser = async (userData: Omit<User, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, COLLECTIONS.USERS), userData);
    return docRef.id;
};

export const getUser = async (userId: string): Promise<User | null> => {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docToData<User>(docSnap) : null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
    const q = query(collection(db, COLLECTIONS.USERS), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty ? null : docToData<User>(querySnapshot.docs[0]);
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<void> => {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(docRef, updates);
};

// ==================== ESCAPE ROOM OPERATIONS ====================

export const createEscapeRoom = async (roomData: Omit<EscapeRoom, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, COLLECTIONS.ESCAPE_ROOMS), roomData);
    return docRef.id;
};

export const getEscapeRoom = async (roomId: string): Promise<EscapeRoom | null> => {
    const docRef = doc(db, COLLECTIONS.ESCAPE_ROOMS, roomId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docToData<EscapeRoom>(docSnap) : null;
};

export const getAllEscapeRooms = async (): Promise<EscapeRoom[]> => {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.ESCAPE_ROOMS));
    return querySnapshot.docs.map(doc => docToData<EscapeRoom>(doc));
};

export const getEscapeRoomsByDifficulty = async (difficulty: string): Promise<EscapeRoom[]> => {
    const q = query(
        collection(db, COLLECTIONS.ESCAPE_ROOMS),
        where('difficulty', '==', difficulty)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => docToData<EscapeRoom>(doc));
};

// ==================== ROOM SCENE OPERATIONS ====================

export const createRoomScene = async (sceneData: Omit<RoomScene, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, COLLECTIONS.ROOM_SCENES), sceneData);
    return docRef.id;
};

export const getRoomScene = async (sceneId: string): Promise<RoomScene | null> => {
    const docRef = doc(db, COLLECTIONS.ROOM_SCENES, sceneId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docToData<RoomScene>(docSnap) : null;
};

export const getRoomScenesByEscapeRoom = async (escapeRoomId: string): Promise<RoomScene[]> => {
    const q = query(
        collection(db, COLLECTIONS.ROOM_SCENES),
        where('escapeRoomId', '==', escapeRoomId),
        orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => docToData<RoomScene>(doc));
};

// ==================== CLUE OPERATIONS ====================

export const createClue = async (clueData: Omit<Clue, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, COLLECTIONS.CLUES), clueData);
    return docRef.id;
};

export const getClue = async (clueId: string): Promise<Clue | null> => {
    const docRef = doc(db, COLLECTIONS.CLUES, clueId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docToData<Clue>(docSnap) : null;
};

export const getCluesByRoomScene = async (roomSceneId: string): Promise<Clue[]> => {
    const q = query(
        collection(db, COLLECTIONS.CLUES),
        where('roomSceneId', '==', roomSceneId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => docToData<Clue>(doc));
};

// ==================== PUZZLE OPERATIONS ====================

export const createPuzzle = async (puzzleData: Omit<Puzzle, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, COLLECTIONS.PUZZLES), puzzleData);
    return docRef.id;
};

export const getPuzzle = async (puzzleId: string): Promise<Puzzle | null> => {
    const docRef = doc(db, COLLECTIONS.PUZZLES, puzzleId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docToData<Puzzle>(docSnap) : null;
};

export const getPuzzlesByRoomScene = async (roomSceneId: string): Promise<Puzzle[]> => {
    const q = query(
        collection(db, COLLECTIONS.PUZZLES),
        where('roomSceneId', '==', roomSceneId),
        orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => docToData<Puzzle>(doc));
};

// ==================== USER SESSION OPERATIONS ====================

export const createUserSession = async (sessionData: Omit<UserSession, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, COLLECTIONS.USER_SESSIONS), sessionData);
    return docRef.id;
};

export const getUserSession = async (sessionId: string): Promise<UserSession | null> => {
    const docRef = doc(db, COLLECTIONS.USER_SESSIONS, sessionId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docToData<UserSession>(docSnap) : null;
};

export const updateUserSession = async (sessionId: string, updates: Partial<UserSession>): Promise<void> => {
    const docRef = doc(db, COLLECTIONS.USER_SESSIONS, sessionId);
    await updateDoc(docRef, updates);
};

export const getUserSessionsByUser = async (userId: string): Promise<UserSession[]> => {
    const q = query(
        collection(db, COLLECTIONS.USER_SESSIONS),
        where('userId', '==', userId),
        orderBy('startTime', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => docToData<UserSession>(doc));
};

export const getActiveUserSession = async (userId: string, escapeRoomId: string): Promise<UserSession | null> => {
    const q = query(
        collection(db, COLLECTIONS.USER_SESSIONS),
        where('userId', '==', userId),
        where('escapeRoomId', '==', escapeRoomId),
        where('completed', '==', false)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty ? null : docToData<UserSession>(querySnapshot.docs[0]);
};

// ==================== PUZZLE ATTEMPT OPERATIONS ====================

export const createPuzzleAttempt = async (attemptData: Omit<PuzzleAttempt, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, COLLECTIONS.PUZZLE_ATTEMPTS), attemptData);
    return docRef.id;
};

export const getPuzzleAttempt = async (attemptId: string): Promise<PuzzleAttempt | null> => {
    const docRef = doc(db, COLLECTIONS.PUZZLE_ATTEMPTS, attemptId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docToData<PuzzleAttempt>(docSnap) : null;
};

export const getPuzzleAttemptsBySession = async (userSessionId: string): Promise<PuzzleAttempt[]> => {
    const q = query(
        collection(db, COLLECTIONS.PUZZLE_ATTEMPTS),
        where('userSessionId', '==', userSessionId),
        orderBy('attemptTime', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => docToData<PuzzleAttempt>(doc));
};

export const getPuzzleAttemptsByPuzzle = async (puzzleId: string): Promise<PuzzleAttempt[]> => {
    const q = query(
        collection(db, COLLECTIONS.PUZZLE_ATTEMPTS),
        where('puzzleId', '==', puzzleId),
        orderBy('attemptTime', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => docToData<PuzzleAttempt>(doc));
};
