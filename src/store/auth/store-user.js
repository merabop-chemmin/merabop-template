import Vue from "vue"
import {Dialog, QSpinnerOrbit} from "quasar"
import firebase from "firebase/app"
import { firestore, functions} from "src/boot/firebase"
import {showSimpleNotification} from "src/functions/show-simple-notification";

let docRef = firestore.collection("users")

const state = {
    users: {},
    user: {},
    editingUser: {},
    summary: {},
    bannerRegisteringUser: {
        message: "",
        color: "",
        btnLabel: "",
        btnIcon: "",
    },
    usersIsLoading: false,
    userIsLoading: false,
    userIsRegistering: false,
    userIsActivating: false,
    userIsDeactivating: false,
    showBannerRegisteringUser: false,
}

const mutations = {
    SET_USERS(state, payload) {
        Vue.set(state.users, payload.uid, payload)
    },
    SET_USER(state, payload) {
        state.user = payload
    },
    SET_EDITING_USER(state, payload) {
        state.editingUser = payload
    },
    RESET_USERS(state) {
        state.users = {}
    },
    SET_BANNER_REGISTERING_USER(state, payload) {
        state.bannerRegisteringUser = payload
    },
    SET_USERS_IS_LOADING(state, value) {
        state.usersIsLoading = value
    },
    SET_USER_IS_LOADING(state, value) {
        state.userIsLoading = value
    },
    SET_USER_IS_REGISTERING(state, value) {
        state.userIsRegistering = value
    },
    SET_USER_IS_ACTIVATING(state, value) {
        state.userIsActivating = value
    },
    SET_USER_IS_DEACTIVATING(state, value) {
        state.userIsDeactivating = value
    },
    SET_SHOW_BANNER_REGISTERING_USER(state, value) {
        state.showBannerRegisteringUser = value
    },
    SET_SUMMARY(state, payload) {
        state.summary = payload
    },
}

const actions = {
    async firestoreFetchUsers(context, { filter }) {
        context.commit("RESET_USERS")
        context.commit("SET_USERS_IS_LOADING", true)
        let documentRef = docRef
        try {
            documentRef = documentRef.where("active", "==", filter.active)
            if (filter.position) { documentRef = documentRef.where("position", "==", filter.position) }
            if (filter.firstname_en) { documentRef = documentRef.orderBy("firstname_en").startAt(filter.firstname_en).endAt(filter.firstname_en + "\uf8ff") }

            await documentRef.onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    context.commit("SET_USERS", {uid: doc.id, ...doc.data()})
                })
                context.commit("SET_USERS_IS_LOADING", false)
            })
        } catch (error) {
            context.commit("SET_USERS_IS_LOADING", false)
            showSimpleNotification({type: "negative", title: 'Error', message: error.message, timeout: 0})
        }
    },
    async firestoreGetSummary(context) {
        try {
            await docRef.doc("summary").get().then((doc) => {
                context.commit("SET_SUMMARY", {uid: doc.id, ...doc.data()})
            })
        } catch (error) {
            showSimpleNotification({type: "negative", title: 'Error', message: error.message, timeout: 0})
        }
    },
    async firestoreGetUsers(context) {
        context.commit("RESET_USERS")
        context.commit("SET_USERS_IS_LOADING", true)
        try {
            await docRef.orderBy("firstname_en").onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    context.commit("SET_USERS", {uid: doc.id, ...doc.data()})
                })
                context.commit("SET_USERS_IS_LOADING", false)
            })
        } catch (error) {
            context.commit("SET_USERS_IS_LOADING", false)
            showSimpleNotification({type: "negative", title: 'Error', message: error.message, timeout: 0})
        }
    },
    async firestoreGetUser(context, {userUID}) {
        context.commit("SET_USER_IS_LOADING", true)
        try {
            await docRef.doc(userUID).get().then((doc) => {
                context.commit("SET_USER", {uid: doc.id, ...doc.data()})
            })
            context.commit("SET_USER_IS_LOADING", false)
        } catch (error) {
            context.commit("SET_USER_IS_LOADING", false)
            showSimpleNotification({type: "negative", title: 'Error', message: error.message, timeout: 0})
        }
    },
    async firestoreGetEditingUser(context, {editingUserUID}) {
        context.commit("SET_USER_IS_LOADING", true)
        try {
            await docRef.doc(editingUserUID).get().then((doc) => {
                context.commit("SET_EDITING_USER", {uid: doc.id, ...doc.data()})
            })
            context.commit("SET_USER_IS_LOADING", false)
        } catch (error) {
            context.commit("SET_USER_IS_LOADING", false)
            showSimpleNotification({type: "negative", title: 'Error', message: error.message, timeout: 0})
        }
    },
    async firestoreCreateUser(context, { userData }) {
        context.commit("SET_USER_IS_REGISTERING", true)
        context.commit("SET_SHOW_BANNER_REGISTERING_USER", true)
        context.commit("SET_BANNER_REGISTERING_USER", {
            message: "registering a new user",
            color: "bg-secondary",
            btnLabel: "",
            btnIcon: "",
        })

        try {
            // INCREMENT TOTAL USERS WHEN CREATE USER
            await docRef.doc("summary").get()
                .then((response) => {
                    if (response.exists) {
                        let increment = firebase.firestore.FieldValue.increment(1)
                        docRef.doc("summary").update({total: increment, active: increment, disable: response.data().disable})
                    } else {
                        docRef.doc("summary").set({ total: 1, active: 1, disable: 0 })
                    }
                })

            let cloudFunctionCreateUser = functions.httpsCallable('cloudFunctionsCreateUser')
            cloudFunctionCreateUser(userData)
                .then((response) => {
                    console.log(response)
                    context.commit("SET_BANNER_REGISTERING_USER", {
                        message: "successfully registered new user",
                        color: "bg-positive",
                        btnLabel: "",
                        btnIcon: "eva-checkmark-outline",
                    })
                    context.commit("SET_USER_IS_REGISTERING", false)
                })
                .catch((error) => {
                    context.commit("SET_BANNER_REGISTERING_USER", {
                        message: "error creating new user in document",
                        color: "bg-negative",
                        btnLabel: "",
                        btnIcon: "eva-alert-triangle-outline",
                    })
                    context.commit("SET_USER_IS_REGISTERING", false)
                })
        } catch (error) {
            context.commit("SET_USER_IS_REGISTERING", false)
            showSimpleNotification({type: "negative", title: 'Error', message: error.message, timeout: 0})
        }
    },
    async firestoreUpdateUser(context, { editingUserUID, editingUserData, userData }) {
        try {
            await docRef.doc(editingUserUID).update({
                // USER
                firstname_en                     : editingUserData.firstname_en,
                lastname_en                     : editingUserData.lastname_en,
                firstname_th                     : editingUserData.firstname_th,
                lastname_th                     : editingUserData.lastname_th,
                username                        : editingUserData.username,
                // PERSONAL
                nickname                        : editingUserData.nickname,
                identification_number            : editingUserData.identification_number,
                gender                          : editingUserData.gender,
                birth_date                      : editingUserData.birth_date,
                nationality                     : editingUserData.nationality,
                ethnic                          : editingUserData.ethnic,
                religion                        : editingUserData.religion,
                blood_group                     : editingUserData.blood_group,
                marital_status                  : editingUserData.marital_status,
                military_status                 : editingUserData.military_status,
                // EMPLOYMENT
                employee_running_number_uid     : editingUserData.employee_running_number_uid,
                employee_id                     : editingUserData.employee_id,
                division                        : editingUserData.division,
                department                      : editingUserData.department,
                section                         : editingUserData.section,
                position                        : editingUserData.position,
                supervisor                      : editingUserData.supervisor,
                start_working_date              : editingUserData.start_working_date,
                working_type                    : editingUserData.working_type,
                working_status                  : editingUserData.working_status,
                // CURRENT ADDRESS
                current_address: {
                    address_name                : editingUserData.current_address.address_name,
                    sub_district                : editingUserData.current_address.sub_district,
                    district                    : editingUserData.current_address.district,
                    province                    : editingUserData.current_address.province,
                    zipcode                     : editingUserData.current_address.zipcode,
                    country                     : editingUserData.current_address.country,
                },
                // HOUSE REGISTRATION ADDRESS
                house_registration_address: {
                    address_name                : editingUserData.house_registration_address.address_name,
                    sub_district                : editingUserData.house_registration_address.sub_district,
                    district                    : editingUserData.house_registration_address.district,
                    province                    : editingUserData.house_registration_address.province,
                    zipcode                     : editingUserData.house_registration_address.zipcode,
                    country                     : editingUserData.house_registration_address.country,
                },
                // CONTACT
                private_phone_number            : editingUserData.private_phone_number,
                company_phone_number            : editingUserData.company_phone_number,
                fax_number                      : editingUserData.fax_number,
                private_email                   : editingUserData.private_email,
                company_email                   : editingUserData.company_email,
                // PERMISSION
                permissions_of_position         : editingUserData.permissions_of_position,
                permissions_of_person           : editingUserData.permissions_of_person,
                permissions_all                 : editingUserData.permissions_all,
                // OTHERS
                // favorites                       : editingUserData.favorites,
                // METADATA
                updated_at                      : firebase.firestore.FieldValue.serverTimestamp(),
                updated_by                      : userData.firstname_en + userData.lastname_en,
                updated_by_uid                  : userData.uid,
            })
            showSimpleNotification({type: "positive", title: "Successfully", message: "Update user successfully", timeout: 5000})
        } catch (error) {
            showSimpleNotification({type: "negative", title: 'Error', message: error.message, timeout: 0})
        }
    },
    async firestoreActivateUser(context, { userUID }) {
        context.commit("SET_USER_IS_ACTIVATING", true)
        const dialog = Dialog.create({
            title: "Activating...",
            progress: { spinner: QSpinnerOrbit, color: "primary" },
            persistent: true,
            ok: false,
        })
        try {
            // INCREMENT ACTIVE USER & DECREMENT DISABLE USER WHEN CREATE USER
            await docRef.doc("summary").get()
                .then((response) => {
                    if (response.exists) {
                        let increment = firebase.firestore.FieldValue.increment(1)
                        let decrement = firebase.firestore.FieldValue.increment(-1)
                        docRef.doc("summary").update({total: response.data().total, active: increment, disable: decrement})
                    } else {
                        docRef.doc("summary").set({ total: 1, active: 0, disable: 1 })
                    }
                })

            let cloudFunctionsActivateUser = functions.httpsCallable('cloudFunctionsActivateUser')
            await cloudFunctionsActivateUser(userUID)
                .then((response) => {
                    dialog.update({
                        title: "Activated",
                        message: "Successfully activated user",
                        progress: false,
                        ok: true
                    })
                    context.dispatch('user/firestoreGetEditingUser', {editingUserUID: userUID}, {root: true})
                    context.dispatch('user/firestoreGetSummary', {}, {root: true})
                    context.commit("SET_USER_IS_ACTIVATING", false)
                })
                .catch((error) => {
                    context.commit("SET_USER_IS_ACTIVATING", false)
                    showSimpleNotification({type: "negative", title: 'Error', message: error.message, timeout: 0})
                })
        } catch (error) {
            context.commit("SET_USER_IS_ACTIVATING", false)
            showSimpleNotification({type: "negative", title: 'Error', message: error.message, timeout: 0})
        }
    },
    async firestoreDeactivateUser(context, { userUID }) {
        context.commit("SET_USER_IS_DEACTIVATING", true)
        const dialog = Dialog.create({
            title: "Deactivating...",
            progress: {
                spinner: QSpinnerOrbit,
                color: "primary",
            },
            persistent: true,
            ok: false,
        })
        try {
            // INCREMENT DISABLE USER & DECREMENT ACTIVE USER WHEN CREATE USER
            await docRef.doc("summary").get()
                .then((response) => {
                    if (response.exists) {
                        let increment = firebase.firestore.FieldValue.increment(1)
                        let decrement = firebase.firestore.FieldValue.increment(-1)
                        docRef.doc("summary").update({total: response.data().total, active: decrement, disable: increment})
                    } else {
                        docRef.doc("summary").set({ total: 1, active: 0, disable: 1 })
                    }
                })

            let cloudFunctionsDeactivateUser = functions.httpsCallable('cloudFunctionsDeactivateUser')
            await cloudFunctionsDeactivateUser(userUID)
                .then((response) => {
                    dialog.update({
                        title: "Deactivated",
                        message: "Successfully deactivated user",
                        progress: false,
                        ok: true,
                    })
                    context.dispatch('user/firestoreGetEditingUser', {editingUserUID: userUID}, {root: true})
                    context.dispatch('user/firestoreGetSummary', {}, {root: true})
                    context.commit("SET_USER_IS_DEACTIVATING", false)
                })
                .catch((error) => {
                    context.commit("SET_USER_IS_DEACTIVATING", false)
                    showSimpleNotification({type: "negative", title: 'Error', message: error.message, timeout: 0})
                })
        } catch (error) {
            context.commit("SET_USER_IS_DEACTIVATING", false)
            showSimpleNotification({type: "negative", title: 'Error', message: error.message, timeout: 0})
        }
    }
}

const getters = {
    user(state) {
        return state.user
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}