<template>
    <q-card :style="{width: width + 'px', maxWidth: '90vw'}">
        <q-card-section class="text-white row items-center" :class="bgColor">
            <div class="text-h6"> {{ $tc(title) }} </div>
            <q-space></q-space>
            <q-btn icon="eva-close-outline" flat round dense v-close-popup></q-btn>
        </q-card-section>

        <q-card-section class="bg-blue-grey-1">
            <slot name="CardSection"></slot>
        </q-card-section>

        <q-card-actions v-if="action" :align="align" class="bg-blue-grey-1">
            <slot name="CardAction"></slot>
        </q-card-actions>
    </q-card>
</template>

<script>
export default {
    props: {
        width: {
            type: String,
            default: "1440",
        },
        bgColor: {
            type: String,
            default: "bg-primary",
        },
        title: {
            type: String,
            default: "please enter dialog title.",
        },
        action: {
            type: Boolean,
            default: false,
        },
        align: {
            type: String,
            default: "right"
        }
    }
}
</script>

<style scoped>

</style>