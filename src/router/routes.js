const routes = [
    {
        path: '/',
        component: () => import('layouts/MainLayout'),
        children: [
            {
                path: '',
                name: "home",
                component: () => import('pages/Home')
            },
        ]
    },
    {
        path: "/auth/",
        component: () => import('layouts/AuthLayout'),
        children: [
            {
                path: "sign-in/",
                name: "sign-in",
                component: () => import('pages/auth/SignIn')
            }
        ]
    },
    // Always leave this as last one,
    // but you can also remove it
    {
        path: '*',
        component: () => import('pages/Error404.vue')
    }
]

export default routes
