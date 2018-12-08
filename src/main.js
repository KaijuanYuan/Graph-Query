// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store/store'
import { writeFileSync } from 'fs';

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    components: { App },
    template: '<App/>',
    // created: async function() {
    //     await this.$store.dispatch('loadAuthors')
    //     await this.$store.dispatch('loadRelations')
    //     await this.$store.dispatch('mixAutRel')
    //     await this.$store.dispatch('loadPapers')
    //     await this.$store.dispatch('loadScholars')
    //     await this.$store.dispatch('attrYear')
    // },
    beforeCreate: async function() {
        await this.$store.dispatch('loadAuthors')
        await this.$store.dispatch('loadRelations')
        await this.$store.dispatch('mixAutRel')
        await this.$store.dispatch('loadPapers')
        await this.$store.dispatch('loadScholars')
        await this.$store.dispatch('attrYear')
            //alert('Now is in beforeCreate')
    },

})

//index.html -> main.js -> App.vue