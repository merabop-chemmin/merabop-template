<template>
    <q-form @submit.prevent="handleClickButton">
        <!-- ERROR BANNER :: EMAIL IS NOT EXISTING -->
        <template v-if="userIsExisting === false">
            <q-banner inline-actions rounded class="bg-negative text-white q-mx-md q-mt-md">
                <div> {{ $tc('we dont recognize this email address. are you sure its correct') }}? </div>
                <template #action>
                    <IconButton flat dense text-color="white" icon="eva-close-outline" @onClick="handleClickCloseBanner" />
                </template>
            </q-banner>
        </template>

        <!-- TAB PANELS :: SIGN IN & FORGOT PASSWORD -->
        <q-tab-panels v-model="tab" animated transition-prev="fade" transition-next="fade" class="bg-transparent">
            <!-- TAB PANEL :: SIGN IN -->
            <q-tab-panel name="sign in">
                <q-card class="q-px-xs rounded-borders" flat>
                    <!-- LOGO & WELCOME MESSAGE -->
                    <q-card-section>
                        <div class="row no-wrap justify-center items-center q-my-md">
                            <img alt="tailwind-ui-logo" src="https://www.wardenswap.com/img/warden-logo-dl.2fac6015.svg" style="width: 48px; height: 48px">
                        </div>
                        <div class="row items-center">
                            <div class="col-12 q-mb-sm">
                                <div class="text-h6 text-weight-medium text-dark tracking-wider"> {{ $tc('welcome to') }} MePurchase </div>
                            </div>
                            <div class="col-12">
                                <div class="text-subtitle2 text-grey-7 tracking-wide"> {{ $tc('please sign-in to your account to get started') }} </div>
                            </div>
                        </div>
                    </q-card-section>
                    <!-- SIGN IN FORM -->
                    <q-card-section>
                        <div class="row items-center">
                            <!-- EMAIL -->
                            <template>
                                <div class="col-12 q-px-xs">
                                    <Label> {{ $tc('username') }} </Label>
                                    <q-input
                                        v-model="editedData.email"
                                        :rules="[val => !!val || $tc('this field is required')]"
                                        lazy-rules=""
                                        @focus="$event.target.select()"
                                        autofocus
                                        dense
                                        outlined>
                                        <template #prepend>
                                            <q-icon name="eva-email-outline" size="16px" />
                                        </template>
                                    </q-input>
                                </div>
                            </template>
                            <!-- PASSWORD -->
                            <template> <!-- existingUser.exists -->
                                <div class="col-12 q-px-xs">
                                    <div class="row items-center">
                                        <div class="col">
                                            <Label> {{ $tc('password') }} </Label>
                                        </div>
                                        <div class="col-auto">
                                            <div class="text-subtitle2 text-weight-medium text-primary cursor-pointer tracking-wide" @click="tab = 'forgot password'"> {{ $tc('forgot your password') }} </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 q-px-xs">
                                    <q-input
                                        v-model="editedData.password"
                                        :rules="[val => !!val || $tc('this field is required')]"
                                        lazy-rules=""
                                        placeholder="············"
                                        :type="showPassword ? 'text' : 'password'"
                                        @focus="$event.target.select()"
                                        dense
                                        outlined>
                                        <template #prepend>
                                            <q-icon name="eva-lock-outline" size="16px"></q-icon>
                                        </template>
                                        <template #append>
                                            <q-icon
                                                class="cursor-pointer"
                                                :name="showPassword ? 'eva-eye-off-outline' : 'eva-eye-outline'"
                                                @click="showPassword = !showPassword"
                                                size="16px"
                                            ></q-icon>
                                        </template>
                                    </q-input>
                                </div>
                            </template>
                        </div>
                    </q-card-section>
                    <!-- SIGN IN BUTTON -->
                    <q-card-section>
                        <div class="row items-center">
                            <div class="col-12 q-px-xs">
                                <SubmitButton unelevated class="full-width" color="primary" :label="$tc('sign in')" :disable="disableSignInButton" />
                            </div>
                        </div>
                    </q-card-section>
                    <!-- MESSAGE -->
                    <q-card-section>
                        <div class="row justify-center items-center">
                            <div class="text-subtitle2 text-weight-medium text-secondary tracking-wide text-center">
                                {{ $tc('new on our platform') }}
                                <br v-if="$q.screen.lt.sm">
                                <span class="text-primary cursor-pointer"> {{ $tc('contact system admin') }} </span>
                            </div>
                        </div>
                    </q-card-section>
                </q-card>
            </q-tab-panel>

            <!-- TAB PANEL :: FORGOT PASSWORD -->
            <q-tab-panel name="forgot password">
                <q-card class="q-pa-xs rounded-borders" flat>
                    <!-- LOGO & WELCOME MESSAGE -->
                    <q-card-section>
                        <div class="row no-wrap justify-center items-center q-my-md">
                            <img alt="tailwind-ui-logo" src="https://www.wardenswap.com/img/warden-logo-dl.2fac6015.svg" style="width: 48px; height: 48px">
                        </div>
                        <div class="row items-center">
                            <div class="col-12 q-mb-sm">
                                <div class="text-h6 text-weight-medium text-dark tracking-wider"> {{ $tc('forgot password') }} </div>
                            </div>
                            <div class="col-12">
                                <div class="text-subtitle2 text-grey-7 tracking-wide"> {{ $tc('enter your email and we will send you instructions to reset your password') }} </div>
                            </div>
                        </div>
                    </q-card-section>
                    <!-- FORGOT PASSWORD FORM -->
                    <q-card-section>
                        <div class="row items-center">
                            <div class="col-12 q-px-xs">
                                <Label required> {{ $tc('email') }} </Label>
                                <q-input
                                    v-model="editedData.email"
                                    :rules="[val => !!val || $tc('this field is required')]"
                                    lazy-rules=""
                                    placeholder="example@email.com"
                                    dense
                                    outlined>
                                    <template #prepend>
                                        <q-icon name="eva-email-outline" size="16px" />
                                    </template>
                                </q-input>
                            </div>
                        </div>
                        <!-- SEND RESET LINK BUTTON -->
                        <div class="row items-center">
                            <div class="col-12 q-px-xs">
                                <SubmitButton
                                    unelevated
                                    class="full-width"
                                    :color="sentResetLink ? 'positive' : 'primary'"
                                    :label="sentResetLink ? $tc('reset link has been sent to your email') : $tc('send reset link') "
                                    :disable="sentResetLink"
                                    :loading="sendingResetLink"
                                />
                            </div>
                        </div>
                    </q-card-section>
                    <!-- MESSAGE -->
                    <q-card-section>
                        <div class="row justify-center items-center text-primary">
                            <q-icon name="eva-arrow-ios-back-outline" class="q-mr-sm q-mt-xs"></q-icon>
                            <span class="text-subtitle2 tracking-wide cursor-pointer" @click="tab = 'sign in'"> {{ $tc('back to login') }} </span>
                        </div>
                    </q-card-section>
                </q-card>
            </q-tab-panel>
        </q-tab-panels>
    </q-form>
</template>

<script>
import IconButton from "components/application-ui/elements/buttons/IconButton";
import Label from "components/application-ui/forms/Label";
import SubmitButton from "components/application-ui/elements/buttons/SubmitButton";
import BaseButton from "components/application-ui/elements/buttons/BaseButton";
import {mapState, mapActions} from "vuex";
export default {
    components: {BaseButton, SubmitButton, Label, IconButton},
    data() {
        return {
            tab: "sign in",
            showPassword: false,
            editedData: {
                email: "",
                password: "",
            }
        }
    },
    methods: {
        ...mapActions('auth', ['firebaseAuthSignInWithEmailAndPassword', 'firebaseAuthSendPasswordResetEmail']),
        handleClickButton() {
            if (this.tab === "sign in") {
                this.firebaseAuthSignInWithEmailAndPassword({ userData: this.editedData })
            } else if (this.tab === "forgot password") {
                this.firebaseAuthSendPasswordResetEmail({email: this.editedData.email})
            }
        },
    },
    computed: {
        ...mapState('auth', ['sendingResetLink', 'sentResetLink', 'inputEmail', 'checkingExistingEmail', 'existingUser', 'userIsExisting']),
        disableSignInButton() {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            const validEmail = re.test(this.editedData.email) // Return true if email is valid
            const validPassword = this.editedData.password.length >= 8 // Return true if password is valid
            return !(validEmail && validPassword)
        },
    }
}
</script>

<style scoped>

</style>