<template>
    <q-form @submit.prevent="save">
        <div class="row">
            <div class="col">
                <q-card class="bg-white q-pa-none q-ma-none" flat>
                    <q-card-section>
                        <div class="row items-center">
                            <div class="col-12 q-mb-sm">
                                <div class="text-subtitle1 text-secondary"> {{ $tc('please enter your registered email to reset your password') }}</div>
                            </div>
                        </div>
                        <div class="row items-center">
                            <div class="col-12 q-mb-sm q-px-xs">
                                <q-input
                                    ref="reset_password_email"
                                    v-model="resetPasswordEmail"
                                    :placeholder="$tc('email')"
                                    :rules="[val => !!val || $tc('this field is required')]"
                                    dense
                                    filled
                                    type="email"
                                >
                                    <template #prepend>
                                        <q-icon name="eva-email-outline"></q-icon>
                                    </template>
                                </q-input>
                            </div>
                        </div>
                        <div class="row items-end">
                            <div class="col">
                                <q-btn
                                    :class="$q.screen.gt.sm ? 'float-right' : 'full-width'"
                                    :color="disableButton ? 'grey-5' : 'positive'"
                                    :disable="disableButton"
                                    :label="$tc('email me')"
                                    :loading="this.resetPasswordEmailIsSending"
                                    icon="eva-paper-plane-outline"
                                    no-caps
                                    type="submit"
                                    unelevated
                                ></q-btn>
                            </div>
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </q-form>
</template>

<script>
import {mapState} from 'vuex'

export default {
    components: {},
    data() {
        return {
            resetPasswordEmail: "",
        }
    },
    methods: {
        save() {
            this.$refs.reset_password_email.validate()
            if (!this.$refs.reset_password_email.hasError) {
                this.$emit('submit', this.resetPasswordEmail)
            }
        }
    },
    computed: {
        ...mapState('auth', ['resetPasswordEmailIsSending']),
        disableButton() {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return !re.test(this.resetPasswordEmail)
        }
    }
}
</script>

<style scoped>

</style>