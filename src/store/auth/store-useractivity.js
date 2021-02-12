import Vue from 'vue'
import { Dialog} from 'quasar'
import firebase from "firebase/app"
import { firestore } from 'src/boot/firebase'
import axios from 'axios'

const state = {
    activities: {},
    activity: {},
    activitiesIsLoading: false,
    activityIsLoading: false,
    userActivitiesIsLoading: false,
    userActivityIsLoading: false,
    recentActivities: {},
    recentActivitiesIsLoading: false,
}

const mutations = {
    SET_USER_ACTIVITIES(state, payload) {
        Vue.set(state.activities, payload.uid, payload)
    },
    SET_USER_ACTIVITY(state, payload) {
        state.activity = payload
    },
    SET_ACTIVITY(state, payload) {
        state.activity = payload
    },
    SET_RECENT_ACTIVITIES(state, payload) {
        Vue.set(state.recentActivities, payload.uid, payload)
    },
    SET_RECENT_ACTIVITIES_IS_LOADING(state, value) {
        state.recentActivitiesIsLoading = value
    },
    SET_ACTIVITIES_IS_LOADING(state, value) {
        state.activitiesIsLoading = value
    },
    SET_ACTIVITY_IS_LOADING(state, value) {
        state.activityIsLoading = value
    },
    SET_USER_ACTIVITIES_IS_LOADING(state, value) {
        state.userActivitiesIsLoading = value
    },
    SET_USER_ACTIVITY_IS_LOADING(state, value) {
        state.userActivityIsLoading = value
    },
}

const actions = {
    async firestoreGetActivities(context) {
        console.log("GET ALL ACTIVITIES")
    },
    async firestoreGetActivity(context, {activityUID}) {
        context.commit("SET_ACTIVITY_IS_LOADING", true)
        try {
            const response = await firestore.collection("admin").doc("organization").collection("users-activity").doc(activityUID).get()
            if (response.exists) {
                context.commit("SET_ACTIVITY", {uid: response.id, ...response.data()})
                context.commit("SET_ACTIVITY_IS_LOADING", false)
            } else {
                context.commit("SET_ACTIVITY_IS_LOADING", false)
                Dialog.create({title: "เกิดข้อผิดพลาดในการดึงข้อมูล", message: "ไม่พบข้อมูล"})
            }
        }
        catch (error) {
            context.commit("SET_ACTIVITY_IS_LOADING", false)
            Dialog.create({title: "เกิดข้อผิดพลาดในการดึงข้อมูล", message: error.message})
        }
    },
    async firestoreGetUserActivities(context, {userUID}) {
        context.commit("SET_USER_ACTIVITIES_IS_LOADING", true)
        try {
            const response = await firestore
                .collection("admin")
                .doc("organization")
                .collection("users")
                .doc(userUID)
                .collection("activities")
                .orderBy("occurred_at", "desc")
                .onSnapshot((querySnapshot) => {
                    querySnapshot.forEach(doc => {
                        context.commit("SET_USER_ACTIVITIES", {uid: doc.id, ...doc.data()})
                    })
                    context.commit("SET_USER_ACTIVITIES_IS_LOADING", false)
                })
        }
        catch (error) {
            context.commit("SET_USER_ACTIVITIES_IS_LOADING", false)
            Dialog.create({title: "เกิดข้อผิดพลาดในการดึงข้อมูล", message: error.message})
        }
    },
    async firestoreGetUserActivity(context, {userUID, activityUID}) {
        context.commit("SET_USER_ACTIVITY_IS_LOADING", true)
        try {
            const response = await firestore
                .collection("admin")
                .doc("organization")
                .collection("users")
                .doc(userUID)
                .collection("activities")
                .doc(activityUID).get()
            if (response.exists) {
                context.commit("SET_USER_ACTIVITY", {uid: response.id, ...response.data()})
                context.commit("SET_USER_ACTIVITY_IS_LOADING", false)
            } else {
                context.commit("SET_USER_ACTIVITY_IS_LOADING", false)
                Dialog.create({title: "เกิดข้อผิดพลาดในการดึงข้อมูล", message: "ไม่พบข้อมูล"})
            }
        }
        catch (error) {
            context.commit("SET_USER_ACTIVITY_IS_LOADING", false)
            Dialog.create({title: "เกิดข้อผิดพลาดในการดึงข้อมูล", message: "ไม่พบข้อมูล"})
        }
    },
    async firestoreGetRecentActivities(context) {
        context.commit('SET_RECENT_ACTIVITIES_IS_LOADING', true)
        try {
            const response = firestore
                .collection("admin")
                .doc("organization")
                .collection("users-activity")
                .orderBy("occurred_at", "desc")
                .limit(10)
                .onSnapshot((querySnapshot) => {
                    querySnapshot.forEach(doc => {
                        context.commit('SET_RECENT_ACTIVITIES', {uid: doc.id, ...doc.data()})
                    })
                    context.commit('SET_RECENT_ACTIVITIES_IS_LOADING', false)
                })
        }
        catch (error) {
            context.commit('SET_RECENT_ACTIVITIES_IS_LOADING', false)
            Dialog.create({title: "เกิดข้อผิดพลาดในการดึงข้อมูล", message: error.message})
        }
    },
    async firestoreCreateActivity(context, { activityData, userData, snapshotData }) {
        try {
            let today = new Date()
            // const ip = await axios.get("https://api.ipify.org?format=json") // FREE
            const ip = await axios.get("https://api.ipgeolocation.io/ipgeo?apiKey=294f90037a6944dcb01b086d6362fb43") // FREE 1,000 REQ/MO
            const activity = {
                user_uid        : userData.user_uid,
                id              : userData.id,
                employee_name   : userData.fullname_en,
                perform         : activityData.perform,
                dataset         : activityData.dataset,
                snapshot        : snapshotData,
                ip_address      : ip.data.ip,
                district        : ip.data.district,
                city            : ip.data.city,
                latitude        : ip.data.latitude,
                longitude       : ip.data.longitude,
                // user_agent      : ip.data.user_agent,
                year            : today.getFullYear(),
                month           : today.getMonth() + 1,
                date            : today.getDate(),
                day             : today.getDay(),
                hour            : today.getHours(),
                minute          : today.getMinutes(),
                occurred_at     : firebase.firestore.FieldValue.serverTimestamp(),
            }
            const createUserActivityDocument = await firestore.collection("admin").doc("organization").collection("users-activity").add(activity)
            const createUserActivitySubCollection = await firestore.collection("admin").doc("organization").collection("users").doc(userData.user_uid).collection("activities").add(activity)
        }
        catch (error) {
            Dialog.create({title: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล", message: error.message})
        }
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