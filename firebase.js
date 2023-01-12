// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore/lite";
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-Y-9ZMlNyX37l_f4_78JJau7gaSpgF3A",
  authDomain: "elondry-3f70e.firebaseapp.com",
  databaseURL: "https://elondry-3f70e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "elondry-3f70e",
  storageBucket: "elondry-3f70e.appspot.com",
  messagingSenderId: "321825712648",
  appId: "1:321825712648:web:2c5bf46dcadbc236ba7fbd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export {db, auth};