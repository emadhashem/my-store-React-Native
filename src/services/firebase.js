import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage'
const firebaseConfig = {
  apiKey: "AIzaSyCJ_R9-Ivvy9cryv2R60QTfNmQeJ5aazgM",
  authDomain: "my-store-aad12.firebaseapp.com",
  databaseURL: "https://my-store-aad12.firebaseio.com",
  projectId: "my-store-aad12",
  storageBucket: "my-store-aad12.appspot.com",
  messagingSenderId: "392969436843",
  appId: "1:392969436843:web:8137d4a2c3384af7ac01ee",
  measurementId: "G-R0G37TXF1J"
};
if (!firebase.apps.length) {
  try {
    firebase.initializeApp(firebaseConfig);
  } catch (err) {
      console.warn('Firebase initialization error raised’, err.stack')
  }
}


export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage()