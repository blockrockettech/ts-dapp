import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        highestBidInEth: 0
    },
    mutations: {
        updateHighestBidInEth(state, {highestBidInEth}) {
            Vue.set(state, 'highestBidInEth', highestBidInEth);
        }
    },
    actions: {
        updateHighestBidInEth({ commit }, highestBidInEth) {
            commit('updateHighestBidInEth', {highestBidInEth});
        }
    },
    getters: {
        contractName: () => {
            return 'TwistedAuctionMock';
        },
        tokenContractAddress: () => {
            return '0xdb131507405b6520fb3d54b927a9549953ea7e4e';
        },
        roundStart: () => (round: number, auctionStartTime: number) => {
            const result = moment.unix(auctionStartTime).utc(false);

            if (round > 1) {
                const offset = round - 1;
                result.add(offset, 'days');
            }

            return result;
        },
        roundEnd: (state, getters) => (round: number, auctionStartTime: number, roundLengthInSeconds: number) => {
            const result = moment(getters.roundStart(round, auctionStartTime));
            result.add(roundLengthInSeconds, 'seconds');
            return result;
        },
        highestBidInEth: (state) => {
            return state.highestBidInEth;
        },
    }
})
