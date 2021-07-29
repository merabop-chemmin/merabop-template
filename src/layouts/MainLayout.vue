<template>
    <q-layout view="lHh Lpr lff" class="bg-blue-grey-1">
        <!-- HEADER -->
        <Header>
            <template #Header>
                <q-toolbar style="height: 64px">
                    <IconButton outline flat round icon="eva-menu-outline" @onClick="leftDrawerOpen = !leftDrawerOpen" />

                    <q-input
                        v-model="search"
                        :placeholder="$tc('search')"
                        class="q-ml-md"
                        dense
                        outlined
                        style="width: 40%"
                    ></q-input>

                    <q-space />

                    <div class="row items-center q-gutter-sm q-ml-md">
                        <template v-if="Object.keys(user).length > 0">
                            <q-btn unelevated round dense color="grey-4" text-color="grey-9" :label="`${user.firstname_en[0].toLocaleUpperCase()}${user.lastname_en[0].toLocaleUpperCase()}`">
                                <q-menu transition-show="jump-down" transition-hide="jump-up">
                                    <div class="row items-center q-px-md q-py-sm">
                                        <div class="col-auto">
                                            <q-avatar color="grey-5" text-color="grey-9" size="md"> {{ user.firstname_en[0].toLocaleUpperCase() }}{{ user.lastname_en[0].toLocaleUpperCase() }} </q-avatar>
                                        </div>
                                        <div class="col q-ml-md">
                                            <div class="text-subtitle1 text-capitalize tracking-wide"> {{ user.firstname_en.toLocaleLowerCase() }} {{ user.lastname_en.toLocaleLowerCase() }} </div>
                                            <div class="text-subtitle2 text-grey-7"> Job Position </div>
                                        </div>
                                    </div>
                                    <q-separator />
                                    <q-list class="text-subtitle2 text-weight-medium" style="min-width: 240px;" dense>
                                        <q-item clickable>
                                            <q-item-section> {{ $tc('language') }} </q-item-section>
                                            <q-item-section side><q-icon name="eva-chevron-right-outline" /></q-item-section>

                                            <q-menu anchor="top end" self="top start">
                                                <q-list style="min-width: 100px">
                                                    <q-item
                                                        v-for="(language, languageIndex) in langOptions"
                                                        :key="languageIndex"
                                                        dense
                                                        clickable
                                                        @click="lang = language.value">
                                                        <q-item-section> {{ language.label }} </q-item-section>
                                                    </q-item>
                                                </q-list>
                                            </q-menu>
                                        </q-item>

                                        <q-item v-close-popup clickable @click="">
                                            <q-item-section> {{ $tc('settings') }} </q-item-section>
                                        </q-item>
                                        <q-separator />
                                        <q-item v-close-popup clickable @click="showSignOutDialog = true">
                                            <q-item-section class="text-negative"> {{ $tc('sign out') }} </q-item-section>
                                        </q-item>
                                    </q-list>
                                </q-menu>
                            </q-btn>
                        </template>
                    </div>
                </q-toolbar>
            </template>
        </Header>

        <!-- DRAWER -->
        <q-drawer v-model="leftDrawerOpen" bordered :width="256">
            <q-scroll-area class="fit">
                <q-toolbar style="height: 64px">
                    <q-toolbar-title class="row items-center text-dark q-ml-sm cursor-pointer" @click="$router.push({name: 'home'})">
                        <q-img src="https://www.wardenswap.com/img/warden-logo-dl.2fac6015.svg" width="32px"></q-img>
                        <span class="text-h5 text-weight-bold q-ml-md"> MERABOP </span>
                    </q-toolbar-title>
                </q-toolbar>

                <!-- NAVIGATION PANEL -->
                <q-list padding>
                    <template v-for="(navigation) in navigationLists">
                        <q-item aria-hidden="true">
                            <q-item-section class="text-grey-7 text-uppercase" style="font-size: 0.8rem"> {{ $tc(navigation.section) }} </q-item-section>
                        </q-item>
                        <template v-for="(menu) in navigation.lists">
                            <q-item clickable class="menu-item" exact-active-class="menu-item-active" exact :to="menu.to" @click="leftDrawerOpen = false">
                                <q-item-section avatar><q-icon :name="menu.icon"/></q-item-section>
                                <q-item-section> {{ $tc(menu.label) }} </q-item-section>
                            </q-item>
                        </template>
                    </template>
                </q-list>
            </q-scroll-area>
        </q-drawer>

        <!-- PAGE CONTAINER -->
        <q-page-container class="bg-blue-grey-1">
            <!-- ROUTER VIEW -->
            <router-view />

            <!-- SIGN OUT DIALOG -->
            <template>
                <q-dialog v-model="showSignOutDialog" persistent>
                    <q-card flat style="width: 480px; max-width: 90vw; border-radius: 10px">
                        <q-card-section class="bg-negative">
                            <div class="row items-center">
                                <div class="col">
                                    <div class="text-subtitle1 text-weight-medium text-white tracking-wider"> {{ $tc('are you sure you want to sign out now') }}? </div>
                                </div>
                                <div class="col-auto">
                                    <IconButton dense round flat text-color="white" icon="eva-close-outline" @onClick="showSignOutDialog = false" />
                                </div>
                            </div>
                        </q-card-section>
                        <q-card-section>

                        </q-card-section>
                        <q-card-section>
                            <div class="row items-center">
                                <div class="col text-right">
                                    <BaseButton
                                        :label="$tc('cancel')"
                                        unelevated
                                        color="grey-3"
                                        text-color="grey-7"
                                        @onClick="showSignOutDialog = false" />
                                    <BaseButton
                                        unelevated
                                        class="q-ml-md"
                                        color="negative"
                                        :label="$tc('sign out')"
                                        @onClick="handleClickSignOut" />
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </q-dialog>
            </template>
        </q-page-container>
    </q-layout>
</template>

<script>
import {mapActions, mapState} from "vuex";
import Header from "components/application-ui/page-layouts/Header";
import IconButton from "components/application-ui/elements/buttons/IconButton";
import BaseButton from "components/application-ui/elements/buttons/BaseButton";

export default {
    components: {BaseButton, IconButton, Header},
    created() {
        this.$i18n.locale = this.$q.localStorage.getItem('language')
    },
    data() {
        return {
            search: "",
            lang: this.$q.localStorage.getItem('language'),
            langOptions: [
                { value: 'th-th', label: 'ภาษาไทย' },
                { value: 'en-us', label: 'English' },
            ],
            leftDrawerOpen: true,
            showSignOutDialog: false,
            navigationLists: [
                {
                    section: "home",
                    lists: [
                        { label: "home", icon: "eva-home-outline", to: { name: "home" } },
                    ]
                },
                {
                    section: "section 1",
                    lists: [
                        { label: "Menu 1", icon: "eva-hash-outline", to: {name: ""} },
                        { label: "Menu 2", icon: "eva-hash-outline", to: {name: ""} },
                        { label: "Menu 3", icon: "eva-hash-outline", to: {name: ""} },
                    ]
                }
            ]
        }
    },
    methods: {
        ...mapActions('auth', ['firebaseAuthSignOut']),
        handleClickSignOut() {
            this.firebaseAuthSignOut()
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

</style>