// utils/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyD6ci0SCTQjdpshLa4rXOUBra4nwlMRafE",
  authDomain: "interview-robot-b6fd5.firebaseapp.com",
  projectId: "interview-robot-b6fd5",
  storageBucket: "interview-robot-b6fd5.firebasestorage.app",
  messagingSenderId: "1092081484607",
  appId: "1:1092081484607:web:e3c8ffd7117b1d10e0c98a",
  measurementId: "G-LC1THL1ZMT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);