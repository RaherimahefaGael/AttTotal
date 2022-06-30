
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

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
const auth = getAuth(app);

// s'inscrire
submitDataUp.addEventListener('click',(e) =>{
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  

createUserWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
// Signed in 
const user = userCredential.user;
    alert('new account created successfully');
})
.catch((error) => {
const errorCode = error.code;
const errorMessage = error.message;
// ..
alert(errorMessage);
});
});

// s'authentifier
submitDataIn.addEventListener('click',(e) =>{
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
  // Signed in 
  const user = userCredential.user;

              window.location=('index1.html');   
      })
.catch((error) => {
  const errorCode = error.code;
  const errorMessage = error.message;
  // ..
  alert(errorMessage);
})
});

