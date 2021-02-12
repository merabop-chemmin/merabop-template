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
            {
                path: "notification/list/",
                name: "notification-list",
                component: () => import('pages/notification/NotificationList')
            },
            // #########################################################################################################
            // DAILY REPORT
            // #########################################################################################################
            {
                path: "daily-report/list/",
                name: "daily-report-list",
                component: () => import('pages/daily-report/DailyReportList'),
            },
            // #########################################################################################################
            // CUSTOMER
            // #########################################################################################################
            {
                path: "customer/list/",
                name: "customer-list",
                component: () => import('pages/customer/CustomerList')
            },
            // #########################################################################################################
            // PRODUCT
            // #########################################################################################################
            {
                path: "product/list/",
                name: "product-list",
                component: () => import('pages/product/ProductList'),
            },
            // #########################################################################################################
            // SALES
            // #########################################################################################################
            {
                path: "quotation/list/",
                name: "quotation-list",
                component: () => import('pages/quotation/QuotationList')
            },
            {
                path: "sales-order/list/",
                name: "sales-order-list",
                component: () => import('pages/sales-order/SalesOrderList')
            },
            // #########################################################################################################
            // SETTINGS
            // #########################################################################################################
            {
                path: "settings/list/",
                name: "settings-list",
                component: () => import('pages/settings/SettingsList')
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
