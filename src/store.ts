import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    getters: {
        contractName: () => {
            return 'TwistedAuctionMock';
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
    }
})
