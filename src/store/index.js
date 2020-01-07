import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        option: {},
        id: '',
    },
    mutations: {
        saveData(state, data) {
            state.option = data.data.option
            state.id = data.data.id
        }
    },
    actions: {},
    modules: {}
})