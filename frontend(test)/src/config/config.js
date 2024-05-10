// Import the functions you need from the SDKs you need

// U got to import required features in config
import { initializeApp} from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANf4LfroYY_Wr7vILCd4nZJ2BO9uQr_-U",
  authDomain: "recipe-generator-14da1.firebaseapp.com",
  projectId: "recipe-generator-14da1",
  storageBucket: "recipe-generator-14da1.appspot.com",
  messagingSenderId: "699633352633",
  appId: "1:699633352633:web:2c938e4ed6acb120ec4068"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// this is the database we are using in our app
export const db =getFirestore(app)
export const auth =getAuth(app)