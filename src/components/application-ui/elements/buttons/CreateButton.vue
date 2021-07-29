<template>
    <q-btn
        :unelevated="unelevated"
        :outline="outline"
        :no-caps="noCaps"
        :color="color"
        :icon="icon"
        :label="label"
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
            default: "primary"
        },
        icon: {
            type: String,
            default: "eva-plus-outline"
        },
        label: {
            type: String,
            default: "Create",
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