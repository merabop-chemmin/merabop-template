<template>
    <q-card class="bg-blue-grey-1 q-pa-none q-ma-none q-mb-md" flat>
        <q-card-section>
            <div class="row items-center">
                <div class="col-12 col-md" :class="$q.screen.gt.sm ? '' : 'q-mb-md'">
                    <div class="text-h5 text-weight-medium text-secondary">
                        {{ title }}
                        <slot name="CardStatus"></slot>
                    </div>
                    <div v-if="subtitle" class="text-subtitle2 text-grey-7 q-mt-xs"> {{ $tc(subtitle) }}</div>
                </div>

                <div class="col-12 col-md-auto">
                    <slot name="CardButton"></slot>
                </div>
            </div>
        </q-card-section>
    </q-card>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
            required: false,
        }
    }
}
</script>

<style scoped>

</style>