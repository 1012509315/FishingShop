import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    user:''
}

const mutations = {
    updateUser(state,value){
        state.user=value

    }
}

export default new Vuex.Store({
    state,mutations
}) 