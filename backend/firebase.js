import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore';
import config from './config.js';

const firebase = initializeApp(config.firebaseConfig);
const db = getFirestore(firebase);

export default db;