<template>
    <q-page class="window-height window-width row justify-center items-center">
        <div class="col-1 col-sm-2 col-md-3 col-lg-4"></div>
        <div class="col-10 col-sm-8 col-md-6 col-lg-4">
            <q-form @submit.prevent="signin">
                <q-card class="q-pa-lg shadow-1" flat style="border-radius: 10px">
                    <q-card-section>
                        <div class="row no-wrap justify-center items-center q-my-md">
                            <img alt="tailwind-ui-logo" src="https://tailwindui.com/img/logos/v1/workflow-mark-on-brand.svg" style="width: 48px; height: 48px">
                        </div>
                        <div class="row no-wrap justify-center items-center">
                            <div class="text-h6 text-weight-bold text-grey-9 tracking-wide"> {{ $tc('sign in to your account') }} </div>
                        </div>
                    </q-card-section>

                    <q-card-section>
                        <div class="row items-center">
                            <div class="col-12 q-mb-sm q-px-xs">
                                <Label required> {{ $tc('email') }} </Label>
                                <q-input
                                    ref="email"
                                    v-model="credentials.email"
                                    :rules="[val => !!val || $tc('this field is required')]"
                                    dense
                                    filled
                                    lazy-rules=""
                                    type="email">
                                    <template #prepend>
                                        <q-icon name="eva-email-outline" />
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-12 q-mb-sm q-px-xs">
                                <Label required> {{ $tc('password') }} </Label>
                                <q-input
                                    ref="password"
                                    v-model="credentials.password"
                                    :rules="[val => val.length >= 8 || $tc('password must contains at least 8 characters')]"
                                    :type="isPassword ? 'password' : 'text'"
                                    dense
                                    filled
                                    lazy-rules="">
                                    <template #prepend>
                                        <q-icon
                                            :name="isPassword ? 'eva-lock-outline' : 'eva-unlock-outline'"
                                            class="cursor-pointer"
                                            @click="isPassword = !isPassword"
                                        ></q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <p class="text-blue-9 text-subtitle2 cursor-pointer" @click="showForgotPasswordDialog = !showForgotPasswordDialog"> {{ $tc('forgot your password') }}? </p>
                        </div>
                    </q-card-section>

                    <q-card-actions class="q-px-md">
                        <q-btn
                            :color="disableButton ? 'grey-5' : 'primary'"
                            :disable="disableButton"
                            :label="$tc('sign in')"
                            :loading="this.userIsSigningIn"
                            class="full-width"
                            type="submit"
                            unelevated>
                        </q-btn>
                    </q-card-actions>
                </q-card>
            </q-form>
        </div>
        <div class="col-1 col-sm-2 col-md-3 col-lg-4"></div>

        <!--FORGOT PASSWORD DIALOG-->
        <q-dialog v-model="showForgotPasswordDialog" persistent>
            <DialogCard :bgColor="'bg-secondary'" :title="'if you forgot your password'" :width="'720'">
                <template #CardSection>
                    <PasswordResetForm @submit="resetPassword"/>
                </template>
            </DialogCard>
        </q-dialog>
    </q-page>
</template>

<script>
import {mapState, mapActions} from "vuex"
import Label from "components/form/Label";
import DialogCard from "components/card/DialogCard";
import PasswordResetForm from "components/form/PasswordResetForm";
export default {
    components: {Label, PasswordResetForm, DialogCard},
    data() {
        return {
            showForgotPasswordDialog: false,
            isPassword: true,
            resetPasswordEmail: "",
            credentials: {
                email: "",
                password: "",
            }
        }
    },
    methods: {
        ...mapActions('auth', ['firebaseAuthSignInWithEmailAndPassword', 'firebaseAuthSendPasswordResetEmail']),
        signin() {
            this.$refs.email.validate()
            this.$refs.password.validate()
            if (!this.$refs.email.hasError &&
                !this.$refs.password.hasError) {
                this.firebaseAuthSignInWithEmailAndPassword({credentials: this.credentials})
            }
        },
        resetPassword(resetPasswordEmail) {
            this.firebaseAuthSendPasswordResetEmail(resetPasswordEmail)
        }
    },
    computed: {
        ...mapState('auth', ['userIsSigningIn']),
        disableButton() {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            const validEmail = re.test(this.credentials.email) // Return true if email is valid
            const validPassword = this.credentials.password.length >= 8 // Return true if password is valid
            return !(validEmail && validPassword)
        }
    },
    watch: {
    
    },
}
</script>

<style scoped>

</style>