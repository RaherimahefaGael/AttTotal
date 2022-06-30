import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";

const firebaseConfig = {

    apiKey: "AIzaSyBQTxcbiMe8KItyDDu1JejFIUXUNJgUfQg",
    authDomain: "biosy-1a05a.firebaseapp.com",
    databaseURL: "https://biosy-1a05a-default-rtdb.firebaseio.com",
    projectId: "biosy-1a05a",
    storageBucket: "biosy-1a05a.appspot.com",
    messagingSenderId: "484422190201",
    appId: "1:484422190201:web:e97cadf9a9f425607ac0a8"
           };


// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth();

// utilisateur connecté
iza.addEventListener('click', (e) => {
                                                                     
     onAuthStateChanged(auth, (user) => {
     if (user) {
     
     const email = user.email;
     console.log(email);
     } 
     });
    })

hivoaka.addEventListener('click', (e) => {
    signOut(auth).then(() => {
        // Sign-out successful.
        window.location.href = "index.html";
      }).catch((error) => {
        // An error happened.
        console.log(error);
      });    
    })
