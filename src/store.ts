import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment';
import {ethers} from 'ethers';
import {getNetworkName} from '@blockrocket/utils';
import {getContractAddressFromTruffleConf} from '@/utils/utils';

import TwistedSisterAuction from '@/truffleconf/auction/TwistedSisterAuction.json';
import TwistedSisterToken from '@/truffleconf/token/TwistedSisterToken.json';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        highestBidInEth: 0,
        paramFromHighestBidder: 1,
        provider: null,
        signer: null,
        chainId: null,
        contracts: null,
        auctionData: {
            currentRoundNumber: null,
            totalRounds: null,
            roundLengthInSeconds: null,
            auctionStartTime: null,
        }
    },
    mutations: {
        updateHighestBidInEth(state, {highestBidInEth}) {
            Vue.set(state, 'highestBidInEth', highestBidInEth);
        },
        updateParamFromHighestBidder(state, {param}) {
            Vue.set(state, 'paramFromHighestBidder', param);
        },

        updateWeb3Objects(state, {provider, signer, chainId, contracts}) {
            Vue.set(state, 'provider', provider);
            Vue.set(state, 'signer', signer);
            Vue.set(state, 'chainId', chainId);
            Vue.set(state, 'contracts', contracts);
        },
        updateCurrentRound(state, {currentRound}) {
            Vue.set(state.auctionData, 'currentRoundNumber', currentRound);
        },
        updateTotalRounds(state, {totalRounds}) {
            Vue.set(state.auctionData, 'totalRounds', totalRounds);
        },
        updateRoundLengthInSeconds(state, {roundLengthInSeconds}) {
            Vue.set(state.auctionData, 'roundLengthInSeconds', roundLengthInSeconds);
        },
        updateAuctionStartTime(state, {auctionStartTime}) {
            Vue.set(state.auctionData, 'auctionStartTime', auctionStartTime);
        }
    },
    actions: {
        updateHighestBidInEth({ commit }, highestBidInEth) {
            commit('updateHighestBidInEth', {highestBidInEth});
        },
        updateParamFromHighestBidder({ commit }, param) {
            commit('updateParamFromHighestBidder', { param });
        },

        bootstrapWeb3({ commit, dispatch }, { provider, signer, chainId }) {
            const contracts = {
                'TwistedSisterAuction': new ethers.Contract(
                    getContractAddressFromTruffleConf(TwistedSisterAuction, chainId),
                    TwistedSisterAuction.abi,
                    signer,
                ),
                'TwistedSisterToken': new ethers.Contract(
                    getContractAddressFromTruffleConf(TwistedSisterToken, chainId),
                    TwistedSisterToken.abi,
                    signer,
                ),
            };
            commit('updateWeb3Objects', {provider, signer, chainId, contracts});
            dispatch('fetchCoreData', {contracts});
        },
        async fetchCoreData({ commit }, {contracts}) {
            const auctionContract = contracts['TwistedSisterAuction'];
            if (auctionContract) {
                const currentRound = await auctionContract.currentRound();
                commit('updateCurrentRound', {currentRound: currentRound.toString()});

                const numOfRounds = await auctionContract.numOfRounds();
                commit('updateTotalRounds', {totalRounds: numOfRounds.toString()});

                const roundLengthInSeconds = await auctionContract.roundLengthInSeconds();
                commit('updateRoundLengthInSeconds', {roundLengthInSeconds: roundLengthInSeconds.toString()});

                const auctionStartTime = await auctionContract.auctionStartTime();
                commit('updateAuctionStartTime', {auctionStartTime: auctionStartTime.toString()});
            }
        },
    },
    getters: {
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
        },


        getNetworkName: state => {
            return state.chainId ? getNetworkName(state.chainId): '';
        },
        auctionData: state => {
            return state.auctionData;
        }
    }
})
