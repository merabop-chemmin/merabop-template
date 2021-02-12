<template>
    <q-layout view="lHh Lpr lff" class="bg-grey-1">
        <!-- HEADER -->
        <q-header bordered class="bg-white text-secondary" height-hint="64">
            <q-toolbar class="MRB__toolbar" style="height: 64px">
                <q-btn
                    flat
                    @click="leftDrawerOpen = !leftDrawerOpen"
                    aria-label="menu"
                    icon="eva-menu-outline"
                    class="q-mx-sm"
                ></q-btn>

                <q-input
                    v-if="$q.screen.gt.sm"
                    v-model="search"
                    :placeholder="$tc('search')"
                    dense
                    standout="bg-blue-grey-5"
                    class="MRB__toolbar-input q-ml-md text-uppercase">
                    <template #prepend>
                        <q-icon v-if="search === ''" name="eva-search-outline"></q-icon>
                        <q-icon v-else name="eva-close-outline" class="cursor-pointer" @click="search = ''"></q-icon>
                    </template>
                </q-input>

                <q-space />

                <div class="q-gutter-sm row items-center q-ml-md">
                    <!-- LANGUAGE BUTTON -->
                    <q-btn
                        flat
                        :label="lang === 'en-us' ? 'ภาษาไทย' : 'English'"
                        :icon="lang === 'en-us' ? 'eva-globe-2-outline' : 'eva-globe-outline'"
                        @click="lang === 'en-us' ? lang = 'th-th' : lang = 'en-us'"
                    ></q-btn>

                    <!-- NOTIFICATION BUTTON -->

                    <!-- USER BUTTON -->
                    <q-btn round dense flat no-wrap class="q-ml-md">
                        <q-avatar size="32px" icon="las la-user-circle">
                            <!-- <img style="width: 24px; height: 24px" src="https://www.flaticon.com/svg/static/icons/svg/847/847969.svg" /> -->
                        </q-avatar>

                        <q-menu auto-close transition-show="jump-down" transition-hide="jump-up">
                            <q-list style="min-width: 200px;">
                                <q-item clickable exact class="q-my-sm">
                                    <q-item-section avatar top>
                                        <q-avatar size="md">
                                            <img src="https://www.flaticon.com/svg/static/icons/svg/847/847969.svg" alt="user-icon">
                                        </q-avatar>
                                    </q-item-section>
                                    <q-item-section v-if="Object.keys(user).length > 0" no-wrap>
                                        <q-item-label> {{ user.fullname_en }} </q-item-label>
                                        <q-item-label caption> {{ user.username }} </q-item-label>
                                        <q-item-label caption> {{ user.position }} {{ user.department }} </q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-separator />

                                <q-item clickable @click="$router.push({name: 'settings-list'})">
                                    <q-item-section no-wrap>
                                        <q-item-label> {{ $tc('settings') }} </q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-item clickable @click="signOutDialog = true">
                                    <q-item-section no-wrap>
                                        <q-item-label> {{ $tc('sign out') }} </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>
                </div>
            </q-toolbar>
        </q-header>

        <!-- DRAWER -->
        <q-drawer v-model="leftDrawerOpen" bordered :width="256">
            <q-scroll-area class="fit">
                <!-- LOGO & BRAND -->
                <q-toolbar class="MRB__toolbar">
                    <q-toolbar-title class="row items-center text-secondary q-ml-sm">
                        <img src="https://tailwindui.com/img/logos/v1/workflow-mark-on-white.svg" style="width: 32px; height: 32px" alt="tailwind-ui-logo">
                        <span class="text-h5 text-weight-bolder text-secondary q-ml-md"> MeSales </span>
                    </q-toolbar-title>
                </q-toolbar>

                <template v-for="(section, index) in sectionList" >
                    <q-list padding :key="index">
                        <q-item aria-label="true">
                            <q-item-section class="text-uppercase text-grey-7" style="font-size: 0.8rem"> {{ $tc(section.section) }} </q-item-section>
                        </q-item>
                        <q-item v-for="(menu, i) in section.menus" :key="i" class="MRB__drawer-item" clickable exact :to="menu.to">
                            <q-item-section avatar>
                                <q-icon :name="menu.icon" />
                            </q-item-section>
                            <q-item-section no-wrap>
                                <q-item-label> {{ $tc(menu.title) }} </q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </template>
            </q-scroll-area>
        </q-drawer>

        <!-- PAGE CONTAINER -->
        <q-page-container class="bg-blue-grey-1">
            <!-- NOTIFICATION BANNER -->

            <!-- ROUTER VIEW -->
            <router-view></router-view>

            <!-- SIGN OUT DIALOG -->
            <template>
                <q-dialog v-model="signOutDialog" persistent>
                    <q-card style="width: 400px; max-width: 60vw">
                        <q-card-section>
                            <div class="text-h6 text-secondary"> {{ $tc('sign out') }} </div>
                        </q-card-section>

                        <q-card-section class="q-pt-none">
                            {{ $tc('are you sure you want to sign out') }}
                        </q-card-section>

                        <q-card-actions align="right">
                            <q-btn outline color="secondary" :label="$tc('cancel')" v-close-popup></q-btn>
                            <q-btn unelevated color="negative" :label="$tc('sign out')" icon="eva-power-outline" @click="signOut"></q-btn>
                        </q-card-actions>
                    </q-card>
                </q-dialog>
            </template>
        </q-page-container>

        <!-- FOOTER -->
        <q-footer reveal bordered class="bg-white text-white" style="height: 0">

        </q-footer>
    </q-layout>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
    created() {
        this.$i18n.locale = this.$q.localStorage.getItem('language')
    },
    data() {
        return {
            leftDrawerOpen: true,
            search: "",
            lang: this.$q.localStorage.getItem('language'),
            signOutDialog: false,
            sectionList: [
                {
                    section: "home",
                    menus: [
                        { title: "home", icon: "eva-home-outline", to: { name: "home" } },
                        { title: "notification", icon: "eva-bell-outline", to: { name: "notification-list" } },
                        { title: "calendar", icon: "eva-calendar-outline",  },
                        { title: "daily report", icon: "eva-file-add-outline", to: { name: "daily-report-list" } },
                        { title: "customer", icon: "eva-people-outline", to: { name: "customer-list" } },
                        { title: "product", icon: "eva-cube-outline", to: { name: "product-list" } },
                    ]
                },
                {
                    section: "sales",
                    menus: [
                        { title: "quotation", icon: "eva-file-outline", to: { name: "quotation-list" } },
                        { title: "sales order", icon: "eva-file-text-outline", to: { name: "sales-order-list" } },
                    ]
                },
                {
                    section: "settings",
                    menus: [
                        { title: "settings", icon: "eva-settings-2-outline", to: { name: "settings-list" } },
                    ]
                }
            ]
        }
    },
    methods: {
        ...mapActions('auth', ['firebaseSignOut']),
        ...mapActions('activity', ['firestoreCreateActivity']),
        signOut() {
            this.firestoreCreateActivity({
                activityData: {perform: "sign out", dataset: "authentication"},
                userData: this.user,
                snapshotData: {},
            }).then(() => {
                this.firebaseSignOut()
            })
        }
    },
    computed: {
        ...mapState('user', ['user']),
    },
    watch: {
        lang(lang) {
            if (lang === 'en-us') {
                this.$i18n.locale = lang
                this.$q.localStorage.set('language', lang)
                this.language = "English"
            } else {
                this.$i18n.locale = lang
                this.$q.localStorage.set('language', lang)
                this.language = "ภาษาไทย"
            }
        }
    }
}
</script>

<style lang="scss">
body {
    font-family: 'Sarabun', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 15px;
}

.MRB {
    &__toolbar {
        height: 64px;
    }

    &__toolbar-input {
        width: 40%
    }

    &__drawer-item {
        line-height: 24px;
        border-radius: 5px;
        margin: 0 8px 0 8px;
        color: #424242;
    }

    &__side-btn {
        &__label {
            font-size: 12px;
            line-height: 24px;
            letter-spacing: .01785714em;
            font-weight: 500;
        }
    }

    &__page-container {
        background-color: #EDF2F7;
    }
}
</style>