<template>
    <q-layout class="hHh lpR fFf">
        <q-page-container class="bg-blue-grey-1">
            <q-page class="row items-center justify-center window-width">
                <div class="col-1 col-sm-2 col-md-3 col-lg-4"></div>
                <div class="col-10 col-sm col-md-6 col-lg-4">
                    <!-- ROUTER VIEW -->
                    <router-view></router-view>

                    <!-- ERROR DIALOG :: SIGN IN -->
                    <q-dialog v-model="isError" persistent>
                        <q-card flat style="width: 480px; max-width: 90vw; border-radius: 10px">
                            <q-card-section class="bg-negative">
                                <div class="row items-center">
                                    <div class="col">
                                        <div class="text-subtitle1 text-weight-medium text-white tracking-wider"> {{ $tc('error occurred') }} </div>
                                    </div>
                                </div>
                            </q-card-section>
                            <q-card-section>
                                <div class="row items-center">
                                    <div class="col">
                                        <div class="text-subtitle2 text-grey-9 tracking-wide"> {{ $tc(error.message) }} </div>
                                    </div>
                                </div>
                            </q-card-section>
                            <q-card-section>
                                <div class="row items-center">
                                    <div class="col text-right">
                                        <BaseButton
                                            :label="$tc('got it')"
                                            unelevated
                                            color="grey-3"
                                            text-color="grey-7"
                                            @onClick="handleGotIt" />
                                    </div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </q-dialog>
                </div>
                <div class="col-1 col-sm-2 col-md-3 col-lg-4"></div>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script>
import {mapState, mapMutations} from "vuex"
import IconButton from "components/application-ui/elements/buttons/IconButton";
import BaseButton from "components/application-ui/elements/buttons/BaseButton";
export default {
    components: {BaseButton, IconButton},
    created() {
        this.$q.localStorage.set('language', 'th-th')
        this.$i18n.locale = this.$q.localStorage.getItem('language')
    },
    methods: {
        ...mapMutations('auth', ['SET_IS_ERROR']),
        handleGotIt() {
            this.SET_IS_ERROR(false)
        }
    },
    computed: {
        ...mapState('auth', ['isError', 'error']),
    }
}
</script>

<style scoped>

</style>