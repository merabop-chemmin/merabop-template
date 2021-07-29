import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/database"
import "firebase/functions"
import "firebase/storage"

let firebaseConfig = {
    apiKey: "AIzaSyA-GzOdVKawtU7cuD1ukG_vMf6YZxIREMc",
    authDomain: "me-crypto.firebaseapp.com",
    projectId: "me-crypto",
    storageBucket: "me-crypto.appspot.com",
    messagingSenderId: "204407465520",
    appId: "1:204407465520:web:7d53d63e776301ae2d6ff5",
    measurementId: "G-C5LX9VE4SC"
}

let firebaseApp     = firebase.initializeApp(firebaseConfig)
let auth           = firebaseApp.auth()
let firestore       = firebaseApp.firestore()
let database       = firebaseApp.database()
let functions      = firebaseApp.functions("asia-east2")
let storage        = firebase.storage()

export {
    firebaseApp,
    auth,
    firestore,
    database,
    functions,
    storage,
}