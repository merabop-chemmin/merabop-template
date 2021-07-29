import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/database"
import "firebase/functions"
import "firebase/storage"

let firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
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