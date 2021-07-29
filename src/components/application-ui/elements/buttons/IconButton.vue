<template>
    <q-btn
        :unelevated="unelevated"
        :outline="outline"
        :round="round"
        :flat="flat"
        :dense="dense"
        :color="color"
        :text-color="textColor"
        :icon="icon"
        :size="size"
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
        flat: {
            type: Boolean,
            default: false,
        },
        round: {
            type: Boolean,
            default: false,
        },
        dense: {
            type: Boolean,
            default: false,
        },
        color: {
            type: String,
            default: "grey-9"
        },
        textColor: {
            type: String,
            default: "grey-9"
        },
        icon: {
            type: String,
            default: "eva-info-outline",
        },
        size: {
            type: String,
            default: "md",
        },
    },
    methods: {
        handleClickButton() {
            this.$emit('onClick')
        }
    }
}
</script>

<style scoped>

</style>