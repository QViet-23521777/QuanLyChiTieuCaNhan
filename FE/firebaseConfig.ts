import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzkkSo0v62weHn5YRak_Q3-SKmpHy4b3w",
  authDomain: "fir-af3f5.firebaseapp.com",
  projectId: "fir-af3f5",
  storageBucket: "fir-af3f5.firebasestorage.app",
  messagingSenderId: "732346107424",
  appId: "1:732346107424:web:abec1b3b7dd78653951e45"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);