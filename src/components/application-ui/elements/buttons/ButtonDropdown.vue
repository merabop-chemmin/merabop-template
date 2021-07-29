<template>
    <q-btn
        v-if="minimal"
        rounded
        dense
        flat
        color="grey-7"
        :icon="icon">
        <q-menu>
            <q-list class="no-wrap">
                <slot name="ButtonList"></slot>
            </q-list>
        </q-menu>
    </q-btn>
    <q-btn-dropdown
        v-else
        stretch
        :unelevated="unelevated"
        :outline="outline"
        dropdown-icon="eva-arrow-ios-downward-outline"
        :class="$q.screen.gt.xs ? 'q-ml-md' : 'full-width'"
        :align="btnAlign"
        :no-caps="noCaps"
        :disable="disable"
        :label="label"
        :color="disable ? 'grey-5' : color"
        :text-color="textColor">
        <q-list class="no-wrap">
            <slot name="ButtonList"></slot>
        </q-list>
    </q-btn-dropdown>
</template>

<script>
export default {
    props: {
        minimal: {
            type: Boolean,
            default: false,
        },
        unelevated: {
            type: Boolean,
            default: false,
        },
        outline: {
            type: Boolean,
            default: false,
        },
        icon: {
            type: String,
            default: "eva-more-vertical-outline",
        },
        label: {
            type: String,
            default: "Options",
        },
        color: {
            type: String,
            default: "secondary",
        },
        textColor: {
            type: String,
            default: "white",
        },
        noCaps: {
            type: Boolean,
            default: true,
        },
        btnAlign: {
            type : String,
            default: 'center'
        },
        disable: {
            type: Boolean,
            default: false,
        },
    },
}
</script>

<style scoped lang="scss">
.q-btn-dropdown {
    border-radius: 6px !important;
}
</style>