import Vue from 'vue'
import Vuex from 'vuex'

import auth from "src/store/auth/store-auth";
import activity from "src/store/auth/store-useractivity"
import user from "src/store/auth/store-user"

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
    const Store = new Vuex.Store({
        modules: {
            auth,
            activity,
            user,
            // CUSTOMER

            // PRODUCT

            // RUNNING NUMBER

            // DROPDOWN OPTIONS
        },

        // enable strict mode (adds overhead!)
        // for dev mode only
        strict: process.env.DEBUGGING
    })

    return Store
}
