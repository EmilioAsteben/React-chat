import firebase from 'firebase/app';
import 'firebase/database'; // If using Firebase database


let firebaseConfig = {
    apiKey: "AIzaSyBWncy_rnFvLT5_2V9oke7NR8GHs7Z8eUg",
    authDomain: "womanup-react-chat.firebaseapp.com",
    databaseURL: "https://womanup-react-chat-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "womanup-react-chat",
    storageBucket: "womanup-react-chat.appspot.com",
    messagingSenderId: "223020093121",
    appId: "1:223020093121:web:99fe770e39896a84064e40"
  };
  
  firebase.initializeApp(firebaseConfig);


export const db = firebase.database();

