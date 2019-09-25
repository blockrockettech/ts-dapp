import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        currentRound: 1,
        totalRounds: 21,
        auctionStartTime: 1569413510
    },
    mutations: {},
    actions: {},
    getters: {
        contractName: () => {
            return 'TwistedAuctionMock';
        },
        currentRound: (state, getters) => {
            if(getters.drizzle && getters.drizzle.isDrizzleInitialized) {
                if (getters.contracts && getters.contracts.getContractData) {
                    console.log('In here!!');
                }
            }

            return state.currentRound;
        },
        totalRounds: (state) => {
            return state.totalRounds;
        },
        roundLengthSeconds: () => {
            return 43200;
        },
        roundStart: (state) => (round: number) => {
            const result = moment.unix(state.auctionStartTime).utc(false);

            if (round > 1) {
                const offset = round - 1;
                result.add(offset, 'days');
            }

            return result;
        },
        roundEnd: (state, getters) => (round: number) => {
            const result = moment(getters.roundStart(round));
            result.add(getters.roundLengthSeconds, 'seconds');
            return result;
        },
    }
})
