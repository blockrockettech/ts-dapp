import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment';

import { getContractAddressFromTruffleConf } from '@blockrocket/vue-drizzle-utils';
import TwistedSisterToken from '@/truffleconf/token/TwistedSisterToken.json';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        highestBidInEth: 0,
        paramFromHighestBidder: 0
    },
    mutations: {
        updateHighestBidInEth(state, {highestBidInEth}) {
            Vue.set(state, 'highestBidInEth', highestBidInEth);
        },
        updateParamFromHighestBidder(state, {param}) {
            Vue.set(state, 'paramFromHighestBidder', param);
        }
    },
    actions: {
        updateHighestBidInEth({ commit }, highestBidInEth) {
            commit('updateHighestBidInEth', {highestBidInEth});
        },
        updateParamFromHighestBidder({ commit }, param) {
            commit('updateParamFromHighestBidder', { param });
        }
    },
    getters: {
        contractName: () => {
            return 'TwistedAuctionMock';
        },
        tokenContractAddress: () => (drizzleInstance: any) => {
            return getContractAddressFromTruffleConf(drizzleInstance, TwistedSisterToken);
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
        paramFromHighestBidder: (state) => {
            return state.paramFromHighestBidder;
        }
    }
})
