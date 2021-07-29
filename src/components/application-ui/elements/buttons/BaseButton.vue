<template>
    <q-btn
        v-if="icon"
        :unelevated="unelevated"
        :outline="outline"
        :no-caps="noCaps"
        :color="color"
        :text-color="textColor"
        :icon="icon"
        :label="label"
        :align="btnAlign"
        :disable="disable"
        @click="handleClickButton"
    ></q-btn>
    <q-btn
        v-else
        :unelevated="unelevated"
        :outline="outline"
        :no-caps="noCaps"
        :color="color"
        :text-color="textColor"
        :label="label"
        :align="btnAlign"
        :disable="disable"
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
            default: "secondary"
        },
        textColor: {
            type: String,
            default: "white",
        },
        icon: {
            type: String,
            required: false
        },
        label: {
            type: String,
            default: "Base",
        },
        btnAlign: {
            type: String,
            default: "center"
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