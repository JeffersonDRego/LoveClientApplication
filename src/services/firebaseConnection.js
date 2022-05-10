import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDXO9A0ydOT7SZNS5dQbIOCg4KwN_Ss4jM",
    authDomain: "loveclient-444c1.firebaseapp.com",
    databaseURL: "https://loveclient-444c1-default-rtdb.firebaseio.com",
    projectId: "loveclient-444c1",
    storageBucket: "loveclient-444c1.appspot.com",
    messagingSenderId: "185095555297",
    appId: "1:185095555297:web:48fb40730e2fd3eec50fa0"
  };
  
  // Initialize Firebase
  if (!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
  }

  export default firebase;