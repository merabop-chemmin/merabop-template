import { LocalStorage } from "quasar"

export default({router}) => {
    router.beforeEach((to, from, next) => {
        let userIsLoggedIn = LocalStorage.getItem('userIsLoggedIn')
        if (!userIsLoggedIn && (to.name !== 'sign-in' && to.name !== 'forgot-password')) {
            next({name: 'sign-in'})
        } else {
            next()
        }
    })
}