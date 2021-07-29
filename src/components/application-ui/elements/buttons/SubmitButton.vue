<template>
    <q-btn
        v-if="icon"
        :unelevated="unelevated"
        :outline="outline"
        :no-caps="noCaps"
        :color="color"
        :icon="icon"
        :label="label"
        :disable="disable"
        type="submit"
        @click="handleClickButton"
    ></q-btn>
    <q-btn
        v-else
        :unelevated="unelevated"
        :outline="outline"
        :no-caps="noCaps"
        :color="color"
        :label="label"
        :disable="disable"
        type="submit"
        @click="handleClickButton"
    ></q-btn>
</template>

<script>
export default {
    props: {
        unelevated: {
            type: Boolean,
            default: false,
        },
        outline: {
            type: Boolean,
            default: false,
        },
        color: {
            type: String,
            default: "positive"
        },
        icon: {
            type: String,
            required: false,
        },
        label: {
            type: String,
            default: "Submit",
        },
        noCaps: {
            type: Boolean,
            default: true,
        },
        disable: {
            type: Boolean,
            default: false,
        }
    },
    methods: {
        handleClickButton() {
            this.$emit('onClick')
        }
    }
}
</script>

<style scoped lang="scss">
.q-btn {
    border-radius: 6px;
}
</style>