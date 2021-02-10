import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/database"
import "firebase/functions"
import "firebase/storage"

let firebaseConfig = {
    apiKey: "AIzaSyAn2gWouDs8cbfnOHCFLXiLRDbHQQhosPM",
    authDomain: "chemmin-corporation-limited.firebaseapp.com",
    databaseURL: "https://chemmin-corporation-limited.firebaseio.com",
    projectId: "chemmin-corporation-limited",
    storageBucket: "chemmin-corporation-limited.appspot.com",
    messagingSenderId: "195755043196",
    appId: "1:195755043196:web:99bbee186e72cb0593dcf9",
    measurementId: "G-9WPBNMK56B"
};

// // Initialize Firebase
let firebaseApp     = firebase.initializeApp(firebaseConfig)
let auth            = firebaseApp.auth()
let firestore       = firebaseApp.firestore()
let database        = firebaseApp.database()
let functions       = firebaseApp.functions("asia-east2")
let storage         = firebase.storage()

export {
    firebaseApp,
    auth,
    firestore,
    database,
    functions,
    storage,
}
