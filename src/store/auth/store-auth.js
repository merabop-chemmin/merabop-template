import { Dialog, LocalStorage } from "quasar";
import { auth } from "src/boot/firebase"

const state = {
    userIsSigningIn: false,
    userIsLoggedIn: false,
    resetPasswordEmailIsSending: false,
}

const mutations = {
    SET_USER_IS_SIGNING_IN(state, value) {
        state.userIsSigningIn = value
    },
    SET_USER_IS_LOGGED_IN(state, value) {
        state.userIsLoggedIn = value
    },
    SET_RESET_PASSWORD_EMAIL_IS_SENDING(state, value) {
        state.resetPasswordEmailIsSending = value
    },
}

const actions = {
    async firebaseAuthSignInWithEmailAndPassword(context, {credentials}) {
        context.commit("SET_USER_IS_SIGNING_IN", true)
        try {
            const response = await auth.signInWithEmailAndPassword(credentials.email, credentials.password)
            const user = await context.dispatch('user/firestoreGetUser', {userUID: response.user.uid}, {root: true})
                .then(() => {
                    context.dispatch('activity/firestoreCreateActivity', {
                        activityData: {perform: "sign in", dataset: "authentication"},
                        userData: context.rootState.user.user,
                        snapshotData: {},
                    }, {root: true}).then(() => {})
                })
            context.commit("SET_USER_IS_SIGNING_IN", false)
        } catch (error) {
            // IF USER IS NOT FOUND
            if (error.code === "auth/user-not-found") {
                Dialog.create({
                    title: "User not found",
                    message: `Not found user with email : (${credentials.email}). There is no user record corresponding to your provided email. The user may have been deleted or suspended.`,
                    persistent: true,
                }).onOk(() => {
                    context.commit("SET_USER_IS_SIGNING_IN", false)
                })
                // IF WRONG PASSWORD
            } else if (error.code === "auth/wrong-password") {
                Dialog.create({
                    title: "Wrong password",
                    message: `The password is invalid or incorrect.`,
                    persistent: true,
                }).onOk(() => {
                    context.commit("SET_USER_IS_SIGNING_IN", false)
                })
            } else if (error.code === "auth/invalid-email") {
                Dialog.create({
                    title: "Invalid email",
                    message: `Your provided email : (${credentials.email}) is invalid. Please try again with a valid email like example@domain.com`,
                    persistent: true,
                }).onOk(() => {
                    context.commit("SET_USER_IS_SIGNING_IN", false)
                })
            } else if (error.code === "auth/user-disabled") {
                Dialog.create({
                    dark: true,
                    title: "User disabled",
                    message: `Your provided email : (${credentials.email}) is disabled by the administrator. Please contact your administrator to enable your email.`,
                    persistent: true,
                }).onOk(() => {
                    context.commit("SET_USER_IS_SIGNING_IN", false)
                })
            } else {
                Dialog.create({
                    title: "Error",
                    message: error.message,
                    persistent: true,
                }).onOk(() => {
                    context.commit("SET_USER_IS_SIGNING_IN", false)
                })
            }
        }
    },
    async firebaseSignOut() {
        try {
            await auth.signOut()
        }
        catch (error) {

        }
    },
    firebaseAuthSendPasswordResetEmail(context, resetPasswordEmail) {
        context.commit("SET_RESET_PASSWORD_EMAIL_IS_SENDING", true)
        auth.sendPasswordResetEmail(resetPasswordEmail)
            .then(() => {
                Dialog.create({
                    title: "Email sent",
                    message: `Please check your email (${resetPasswordEmail}) to set your new password.`,
                    persistent: true,
                }).onOk(() => {
                    context.commit("SET_RESET_PASSWORD_EMAIL_IS_SENDING", false)
                })
            })
            .catch((error) => {
                if (error.code === 'auth/invalid-email') {
                    Dialog.create({
                        title: "Invalid email",
                        message: `Your provided email : (${resetPasswordEmail}) is invalid. Please try again with a valid email like example@domain.com.`,
                        persistent: true,
                    }).onOk(() => {
                        context.commit("SET_RESET_PASSWORD_EMAIL_IS_SENDING", false)
                    })
                } else if (error.code === 'auth/user-not-found') {
                    Dialog.create({
                        title: "User not found",
                        message: `Not found user with email : (${resetPasswordEmail}). There is no user record corresponding to your provided email. The user may have been deleted or suspended.`,
                        persistent: true,
                    }).onOk(() => {
                        context.commit("SET_RESET_PASSWORD_EMAIL_IS_SENDING", false)
                    })
                } else {
                    Dialog.create({
                        title: "Error",
                        message: error.message,
                        persistent: true,
                    }).onOk(() => {
                        context.commit("SET_RESET_PASSWORD_EMAIL_IS_SENDING", false)
                    })
                }
            })
    },
    handleAuthStateChanged(context) {
        auth.onAuthStateChanged((user) => {
            if (user) {
                // if (user.verify) {
                // let user = firebase.auth().currentUser
                // user.sendEmailVerification()
                // .then()
                // .catch((error) => {
                //
                // })
                // } else {
                // DOING THE SAMEs
                // }
                context.commit('SET_USER_IS_LOGGED_IN', true)
                LocalStorage.set('userIsLoggedIn', true)
                context.dispatch('user/firestoreGetUser', {userUID: user.uid}, {root: true}).then(() => {})
                this.$router.push({ name: 'home' }).catch(() => {})
            } else {
                context.commit('SET_USER_IS_LOGGED_IN', false)
                LocalStorage.set('userIsLoggedIn', false)
                this.$router.replace({ name: 'sign-in' }).catch(() => {})
            }
        })
    },
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