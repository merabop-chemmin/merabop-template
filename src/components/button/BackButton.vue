<template>
    <q-btn
        :class="$q.screen.gt.sm ? 'q-ml-sm' : 'full-width q-mb-sm'"
        unelevated
        color="grey-7"
        :icon="icon"
        :label="label"
        @click="$router.back()"
    ></q-btn>
</template>

<script>
export default {
    components: {},
    async preFetch({store, currentRoute}) {
    
    },
    props: {
        label: {
            type: String,
            default: "back"
        },
        icon: {
            type: String,
            default: "eva-arrow-ios-back-outline"
        },
    },
    data() {
        return {
        
        }
    },
    methods: {
        handleClickButton() {
            this.$emit('onClick')
        }
    },
    computed: {
    
    },
    watch: {
    
    },
}
</script>

<style scoped>

</style>