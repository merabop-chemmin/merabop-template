<template>
    <div class="text-subtitle2 text-secondary q-mb-xs">
        <slot></slot>
        <span v-if="required"> * </span>
        <q-icon v-if="tooltip" class="q-mb-xs cursor-pointer" color="primary" name="eva-external-link-outline" @click="handleClickButton">
            <q-tooltip anchor="center middle" content-style="font-size: 14px" self="center left"> {{ helpText }}</q-tooltip>
        </q-icon>
    </div>
</template>

<script>
export default {
    props: {
        required: {
            type: Boolean,
            default: false,
        },
        tooltip: {
            type: Boolean,
            default: false,
        },
        helpText: {
            type: String,
            default: "please enter help text.",
        }
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