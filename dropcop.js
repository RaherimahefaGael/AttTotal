
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js";

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
const db = getFirestore(app);


const querySnapshotA = await getDocs(collection(db, "coperative"));
querySnapshotA.forEach((doc) => {
var data =  doc.data().Nom_Coperative;
var row  =  `<select>
                <option>${data}</option>
            </select>
            `;
var table = document.getElementById('voiture-coperative')
table.innerHTML += row;
});

const querySnapshotB = await getDocs(collection(db, "proprio"));
querySnapshotB.forEach((doc) => {
var cin =  doc.data().CIN;
var row  =  `<select>
                <option>${cin}</option>
            </select>
            `;
var table = document.getElementById('voiture-cin')
table.innerHTML += row;
});
