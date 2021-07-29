<template>
    <q-card class="bg-transparent q-pa-none q-ma-none q-mb-md" flat>
        <q-card-section>
            <div class="row" :class="$q.screen.gt.sm ? 'items-center' : 'items-start'">
                <div class="col-auto">
                    <slot name="Avatar"></slot>
                </div>
                <div class="col-12 col-md" :class="$q.screen.lt.sm ? 'q-mb-md' : ''">
                    <!-- BREADCRUMBS -->
                    <q-breadcrumbs class="text-grey-7 q-mb-xs" active-color="primary" gutter="md" v-if="$q.screen.gt.sm">
                        <template v-slot:separator>
                            <q-icon name="eva-arrow-ios-forward-outline"></q-icon>
                        </template>
                        <template v-for="(breadcrumb) in breadcrumbs">
                            <q-breadcrumbs-el :label="$tc(breadcrumb.label)" :to="breadcrumb.to" />
                        </template>
                    </q-breadcrumbs>

                    <!-- TITLE -->
                    <div class="text-h5 text-weight-medium text-dark tracking-wider"> {{ title }} </div>

                    <!-- META -->
                    <slot name="Meta"></slot>
                </div>
                <div class="col-12 col-md-auto text-right">
                    <slot name="Actions"></slot>
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
        meta: {
            type: String,
            required: false,
        },
        breadcrumbs: {
            type: Array,
            required: false,
        }
    }
}
</script>

<style scoped>

</style>