<template>
    <q-page class="q-ma-md">
        <!-- HEADER CARD -->
        <HeaderCard :title="$tc('customer list')">
            <template #CardButton>
                <BackButton :label="$tc('back')" />
            </template>
        </HeaderCard>
    </q-page>
</template>

<script>
import HeaderCard from "components/card/HeaderCard";
import BackButton from "components/button/BackButton";
export default {
    components: {BackButton, HeaderCard},
    async preFetch({store, currentRoute}) {
    
    },
    data() {
        return {
        
        }
    },
    methods: {
    
    },
    computed: {
    
    },
    watch: {
    
    },
}
</script>

<style scoped>

</style>