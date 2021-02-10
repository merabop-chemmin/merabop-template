import Vue from "vue"
import {Dialog, Notify, QSpinner} from "quasar"
import firebase from "firebase/app"
import {firestore, functions} from "src/boot/firebase"

const state = {
    users: {},
    user: {},
    editingUser: {},
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
}

const actions = {
    async firestoreGetUsers(context) {
        context.commit("SET_USERS_IS_LOADING", true)
        try {
            const response = await firestore.collection("admin").doc("organization").collection("users").orderBy("id").onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    context.commit("SET_USERS", {uid: doc.id, ...doc.data()})
                })
                context.commit("SET_USERS_IS_LOADING", false)
            })
        } catch (error) {
            context.commit("SET_USERS_IS_LOADING", false)
            Dialog.create({title: "เกิดข้อผิดพลาดในการดึงข้อมูล", message: error.message})
        }
    },
    async firestoreGetUser(context, {userUID}) {
        context.commit("SET_USER_IS_LOADING", true)
        try {
            const response = await firestore.collection("admin").doc("organization").collection("users").doc(userUID).get()
            if (response.exists) {
                context.commit("SET_USER", {uid: response.id, ...response.data()})
                context.commit("SET_USER_IS_LOADING", false)
            } else {
                context.commit("SET_USER_IS_LOADING", false)
                Dialog.create({title: "เกิดข้อผิดพลาดในการดึงข้อมูล", message: "ไม่พบข้อมูล"})
            }
        } catch (error) {
            context.commit("SET_USER_IS_LOADING", false)
            Dialog.create({title: "เกิดข้อผิดพลาดในการดึงข้อมูล", message: error.message})
        }
    },
    async firestoreGetEditingUser(context, { editingUserUID }) {
        context.commit("SET_USER_IS_LOADING", true)
        try {
            const response = await firestore.collection("admin").doc("organization").collection("users").doc(editingUserUID).get()
            if (response.exists) {
                context.commit("SET_EDITING_USER", {uid: response.uid, ...response.data()})
                context.commit("SET_USER_IS_LOADING", false)
            } else {
                context.commit("SET_USER_IS_LOADING", false)
                Dialog.create({title: "เกิดข้อผิดพลาดในการดึงข้อมูล", message: "ไม่พบข้อมูล"})
            }
        } catch (error) {
            context.commit("SET_USER_IS_LOADING", false)
            Dialog.create({title: "เกิดข้อผิดพลาดในการดึงข้อมูล", message: error.message})
        }
    },
    async functionsCreateUser(context, { userData }) {
        context.commit("SET_USER_IS_REGISTERING", true)
        context.commit("SET_SHOW_BANNER_REGISTERING_USER", true)
        context.commit("SET_BANNER_REGISTERING_USER", {
            message: "registering a new user",
            color: "bg-secondary",
            btnLabel: "",
            btnIcon: "",
        })

        try {
            // INCREMENT TOTAL USERS WHEN DEPARTMENT IS CREATED
            await firestore.collection("summary").doc("admin").collection("users").doc("total").get()
                .then(total => {
                    if (total.exists) {
                        const increment = firebase.firestore.FieldValue.increment(1)
                        firestore.collection("summary").doc("admin").collection("users").doc("total").update({total: increment})
                    } else {
                        firestore.collection("summary").doc("admin").collection("users").doc("total").set({total: 1})
                    }
                })

            let cloudFunctionsCreateUser = functions.httpsCallable('cloudFunctionsCreateUser')
            cloudFunctionsCreateUser(userData)
                .then((response) => {
                    console.log(response)
                    context.commit("SET_BANNER_REGISTERING_USER", {
                        message: response.data.firebaseMessage.errorInfo.message ? response.data.message + " : " + response.data.firebaseMessage.errorInfo.message : response.data.message,
                        color: "bg-" + response.data.color,
                        btnLabel: "",
                        btnIcon: response.data.status === "success" ? "eva-checkmark-outline" : "eva-alert-triangle-outline",
                    })
                    context.commit("SET_USER_IS_REGISTERING", false)
                })
                .catch((error) => {
                    context.commit("SET_BANNER_REGISTERING_USER", {
                        message: error.data.message,
                        color: "bg-" + error.data.color,
                        btnLabel: "",
                        btnIcon: response.data.status === "success" ? "eva-checkmark-outline" : "eva-alert-triangle-outline",
                    })
                    context.commit("SET_USER_IS_REGISTERING", false)
                })
        }
        catch (error) {
            context.commit("SET_USER_IS_REGISTERING", false)
            Dialog.create({title: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล", message: error.message})
        }

        // return new Promise((resolve, reject) => {
        //     let cloudFunctionsCreateUser = functions.httpsCallable('cloudFunctionsCreateUser')
        //     cloudFunctionsCreateUser(userData)
        //         .then((response) => {
        //             context.commit("SET_BANNER_REGISTERING_USER", {
        //                 message: "successfully registered new user",
        //                 color: "bg-positive",
        //                 btnLabel: "",
        //                 btnIcon: "eva-checkmark-outline",
        //             })
        //             context.commit("SET_USER_IS_REGISTERING", false)
        //             resolve()
        //         })
        //         .catch((error) => {
        //             context.commit("SET_BANNER_REGISTERING_USER", {
        //                 message: "there was an error registering a new user",
        //                 color: "bg-negative",
        //                 btnLabel: "",
        //                 btnIcon: "eva-alert-triangle-outline",
        //             })
        //             context.commit("SET_USER_IS_REGISTERING", false)
        //             reject()
        //         })
        // })

    },
    async firestoreUpdateUser(context, { editingUserUID, editingUserData, userData }) {
        try {
            const response = await firestore.collection("admin").doc("organization").collection("users").doc(editingUserUID).update({
                // USER
                firstname_en        : editingUserData.firstname_en,
                lastname_en         : editingUserData.lastname_en,
                fullname_en         : editingUserData.fullname_en,
                firstname_th        : editingUserData.firstname_th,
                lastname_th         : editingUserData.lastname_th,
                fullname_th         : editingUserData.fullname_th,
                user_uid            : editingUserData.user_uid,
                username            : editingUserData.username,
                // PERSONAL
                nickname            : editingUserData.nickname,
                id_card_number      : editingUserData.id_card_number,
                gender              : editingUserData.gender,
                birth_date          : editingUserData.birth_date,
                nationality         : editingUserData.nationality,
                ethnic              : editingUserData.ethnic,
                religion            : editingUserData.religion,
                blood_group         : editingUserData.blood_group,
                marital_status      : editingUserData.marital_status,
                military_status     : editingUserData.military_status,
                // EMPLOYMENT
                employee_running_number_uid: editingUserData.employee_running_number_uid,
                id                  : editingUserData.id,
                division            : editingUserData.division,
                department          : editingUserData.department,
                section             : editingUserData.section,
                position            : editingUserData.position,
                supervisor          : editingUserData.supervisor,
                start_working_date  : editingUserData.start_working_date,
                working_type        : editingUserData.working_type,
                working_status      : editingUserData.working_status,
                // ADDRESS
                address_name        : editingUserData.address_name,
                subdistrict         : editingUserData.subdistrict,
                district            : editingUserData.district,
                province            : editingUserData.province,
                zipcode             : editingUserData.zipcode,
                country             : editingUserData.country,
                // CONTACT
                phone               : editingUserData.phone,
                fax                 : editingUserData.fax,
                email               : editingUserData.email,
                line_id             : editingUserData.line_id,
                // PERMISSIONS
                permissions         : editingUserData.permissions,
                // OTHER
                updated_at          : firebase.firestore.FieldValue.serverTimestamp(),
                updated_by          : userData.fullname_en
            })
            await this.$router.push({name: 'organization-user-list'})
            Notify.create({
                type: "positive",
                message: "Updated user information successfully !",
                position: "bottom-right",
                progress: true,
                timeout: 10000,
            })
        } catch (error) {
            Dialog.create({title: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล", message: error.message})
        }
    },
    async functionsActivateUser(context, { userUID }) {
        context.commit("SET_USER_IS_ACTIVATING", true)
        const dialog = Dialog.create({
            title: "Activating...",
            progress: { spinner: QSpinner, color: "primary" },
            persistent: true,
            ok: false,
        })
        try {
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
                    context.commit("SET_USER_IS_ACTIVATING", false)
                })
                .catch((error) => {
                    context.commit("SET_USER_IS_ACTIVATING", false)
                    dialog.update({title: "Something went wrong", message: error.data.message, progress: false, ok: true})
                })
        } catch (error) {
            context.commit("SET_USER_IS_ACTIVATING", false)
            dialog.update({title: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล", message: error.message, progress: false, ok: true})
        }
    },
    async functionsDeactivateUser(context, {userUID}) {
        context.commit("SET_USER_IS_DEACTIVATING", true)
        const dialog = Dialog.create({
            title: "Deactivating...",
            progress: {
                spinner: QSpinner,
                color: "primary",
            },
            persistent: true,
            ok: false,
        })
        try {
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
                    context.commit("SET_USER_IS_DEACTIVATING", false)
                })
                .catch((error) => {
                    context.commit("SET_USER_IS_DEACTIVATING", false)
                    dialog.update({title: "Something went wrong", message: error.data.message, progress: false, ok: true})
                })
        } catch (error) {
            context.commit("SET_USER_IS_DEACTIVATING", false)
            dialog.update({title: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล", message: error.message, progress: false, ok: true})
        }
    },
}

const getters = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}