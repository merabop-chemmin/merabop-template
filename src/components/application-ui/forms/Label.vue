<template>
    <div class="text-subtitle2 text-dark">
        <slot></slot>
        <span v-if="required"> * </span>
        <q-icon v-if="tooltip" class="q-mb-xs cursor-pointer" color="primary" :name="tooltipIcon" @click="handleClickButton">
            <q-tooltip anchor="center middle" content-style="font-size: 14px" self="center left"> {{ tooltipText }}</q-tooltip>
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
        tooltipIcon: {
            type: String,
            default: "eva-info-outline",
        },
        tooltipText: {
            type: String,
            default: "please enter tooltip text",
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