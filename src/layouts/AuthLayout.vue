<template>
    <q-layout view="hHh lpR fFf">
        <q-page-container class="bg-blue-grey-1">
            <router-view></router-view>
        </q-page-container>
    </q-layout>
</template>

<script>
export default {
    components: {},
    created() {
        this.$i18n.locale = this.$q.localStorage.getItem('language') || 'en-us'
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

<style lang="scss">
body {
    font-family: 'Mitr', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif
}

.MRB {

    &__page-container {
        background-color: #EDF2F7;
    }
}
</style>