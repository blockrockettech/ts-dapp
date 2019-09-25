import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        currentRound: 1
    },
    mutations: {},
    actions: {},
    getters: {
        contractName: () => {
            return 'TwistedAuctionMock';
        },
        currentRound: (state) => {
            return state.currentRound;
        }
    }
})
