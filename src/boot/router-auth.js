import { LocalStorage } from "quasar";

export default ({ router }) => {
    router.beforeEach((to, from, next) => {
        // if (to.name === "supplier-supplierUID-transfer2") {
        //     // SET LOCALSTORAGE => anonymous
        //     // SET SUPPLIER UID => supplierUID
        //     if (LocalStorage === 'anonymous') {
        //         supplier-supplierUID-transfer2
        //     }
        // }
        let userIsLoggedIn = LocalStorage.getItem('userIsLoggedIn')
        if (!userIsLoggedIn && to.name !== 'sign-in') {
            next({ name: 'sign-in' })
        } else {
            next()
        }
    })
}