import {LocalStorage} from "quasar";
import { auth, firestore, functions } from "boot/firebase";

const state = {
    userIsSigningIn: false,
    userIsLoggedIn: false,
    sendingResetLink: false,
    sentResetLink: false,
    isError: false,
    error: {
        code: "",
        message: "",
    },
    // CHECKING EXISTING EMAIL
    inputEmail: "",
    checkingExistingEmail: false,
    existingUser: {},
    userIsExisting: null,
}

const mutations = {
    SET_USER_IS_SIGNING_IN(state, value) {
        state.userIsSigningIn = value
    },
    SET_USER_IS_LOGGED_IN(state, value) {
        state.userIsLoggedIn = value
    },
    SET_SENDING_RESET_LINK(state, value) {
        state.sendingResetLink = value
    },
    SET_SENT_RESET_LINK(state, value) {
        state.sentResetLink = value
    },
    SET_IS_ERROR(state, value) {
        state.isError = value
    },
    SET_ERROR(state, payload) {
        state.error = payload
    },
    SET_INPUT_EMAIL(state, payload) {
        state.inputEmail = payload
    },
    SET_CHECKING_EXISTING_EMAIL(state, value) {
        state.checkingExistingEmail = value
    },
    SET_EXISTING_USER(state, payload) {
        state.existingUser = payload
    },
    SET_USER_IS_EXISTING(state, value) {
        state.userIsExisting = value
    }
}

const actions = {
    async firebaseAuthSignInWithEmailAndPassword(context, {userData}) {
        context.commit("SET_USER_IS_SIGNING_IN", true)
        try {
            await auth.signInWithEmailAndPassword(userData.email, userData.password)
            context.commit("SET_USER_IS_SIGNING_IN", false)
        } catch (error) {
            context.commit("SET_IS_ERROR", true)
            context.commit("SET_ERROR", {code: error.code, message: error.message})
        }
    },
    async firebaseAuthSendPasswordResetEmail(context, {email}) {
        context.commit("SET_SENDING_RESET_LINK", true)
        try {
            await auth.sendPasswordResetEmail(email).then(() => {
                context.commit("SET_SENT_RESET_LINK", true)
                context.commit("SET_SENDING_RESET_LINK", false)
            })
        } catch (error) {
            context.commit("SET_SENDING_RESET_LINK", false)
            context.commit("SET_ERROR", {code: error.code, message: error.message})
        }
    },
    async firebaseAuthSignOut(context) {
        try {
            await auth.signOut()
        } catch (error) {
            context.commit("SET_ERROR", {code: error.code, message: error.message})
        }
    },
    async handleAuthStateChanged(context) {
        await auth.onAuthStateChanged((user) => {
            if (user) {
                context.commit("SET_USER_IS_LOGGED_IN", true)
                LocalStorage.set('userIsLoggedIn', true)
                context.dispatch('user/firestoreGetUser', {userUID: user.uid}, {root: true}).then(() => {})
                this.$router.push({name: "home"}).catch(() => {})
            } else {
                context.commit("SET_USER_IS_LOGGED_IN", false)
                LocalStorage.set('userIsLoggedIn', false)
                this.$router.replace({ name: 'sign-in' }).catch(() => {})
            }
        })
    }
}

const getters = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}