<template>
    <q-card-section @click="handleClick">
        <div class="row items-center">
            <div class="col-12 col-sm">
                <div class="text-subtitle1 text-weight-medium text-dark tracking-wide text-capitalize"> {{ title }} </div>
            </div>
            <div class="col-12 col-sm-auto">
                <slot></slot>
            </div>
        </div>
    </q-card-section>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        }
    },
    methods: {
        handleClick() {
            this.$emit('onClick')
        }
    }
}
</script>

<style scoped>

</style>