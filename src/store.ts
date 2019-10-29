import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment';
import {ethers, utils} from 'ethers';
import {getNetworkName} from '@blockrocket/utils';
import {getContractAddressFromTruffleConf, getDomain} from '@/utils/utils';

import TwistedSisterAuction from '@/truffleconf/auction/TwistedSisterAuction.json';
import TwistedSisterToken from '@/truffleconf/token/TwistedSisterToken.json';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        provider: null,
        signer: null,
        chainId: null,
        contracts: null,
        baseUrls: null,
        auctionData: {
            currentRound: {
                roundNumber: null,
                highestBidInEth: null,
                paramFromHighestBidder: 1,
            },
            totalRounds: null,
            roundLengthInSeconds: null,
            auctionStartTime: null,
            minBid: null,
            events: {
                roundFinalised: null,
            }
        }
    },
    mutations: {
        updateWeb3Objects(state, {provider, signer, chainId, contracts, baseUrls}) {
            Vue.set(state, 'provider', provider);
            Vue.set(state, 'signer', signer);
            Vue.set(state, 'chainId', chainId);
            Vue.set(state, 'contracts', contracts);
            Vue.set(state, 'baseUrls', baseUrls);
        },
        updateCurrentRound(state, {currentRound}) {
            Vue.set(state.auctionData.currentRound, 'roundNumber', currentRound);
        },
        updateTotalRounds(state, {totalRounds}) {
            Vue.set(state.auctionData, 'totalRounds', totalRounds);
        },
        updateRoundLengthInSeconds(state, {roundLengthInSeconds}) {
            Vue.set(state.auctionData, 'roundLengthInSeconds', roundLengthInSeconds);
        },
        updateAuctionStartTime(state, {auctionStartTime}) {
            Vue.set(state.auctionData, 'auctionStartTime', auctionStartTime);
        },
        updateMinBid(state, {minBid}) {
            Vue.set(state.auctionData, 'minBid', minBid);
        },
        updateHighestBidInEth(state, {highestBidInEth}) {
            Vue.set(state.auctionData.currentRound, 'highestBidInEth', highestBidInEth);
        },
        updateParamFromHighestBidder(state, {param}) {
            Vue.set(state.auctionData.currentRound, 'paramFromHighestBidder', param);
        },
        updateRoundFinalisedEvents(state, {events}) {
            Vue.set(state.auctionData.events, 'roundFinalised', events);
        },
    },
    actions: {
        updateHighestBidInEth({ commit }, highestBidInEth) {
            commit('updateHighestBidInEth', {highestBidInEth});
        },
        updateParamFromHighestBidder({ commit }, param) {
            commit('updateParamFromHighestBidder', { param });
        },

        bootstrapWeb3({ commit, dispatch }, { provider, signer, chainId }) {
            const auctionAddress = getContractAddressFromTruffleConf(TwistedSisterAuction, chainId);
            const tokenAddress = getContractAddressFromTruffleConf(TwistedSisterToken, chainId);
            const contracts = {
                TwistedSisterAuction: new ethers.Contract(
                    auctionAddress,
                    TwistedSisterAuction.abi,
                    signer,
                ),
                TwistedSisterToken: new ethers.Contract(
                    tokenAddress,
                    TwistedSisterToken.abi,
                    signer,
                ),
            };

            const network = getNetworkName(chainId);
            const openSeaDomain = getDomain(network, 'opensea');
            const etherscanDomain = getDomain(network, 'etherscan');
            const baseUrls = {
                openSea: `${openSeaDomain}/assets/${tokenAddress}`,
                etherScan: `${etherscanDomain}/token/${tokenAddress}`
            };

            commit('updateWeb3Objects', {provider, signer, chainId, contracts, baseUrls});
            dispatch('fetchCoreData', {provider, contracts});
        },
        async fetchCoreData({ commit }, {provider, contracts}) {
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

                const minBid = await auctionContract.minBid();
                commit('updateMinBid', {minBid: minBid.toString()});

                const highestBidFromRound = await auctionContract.highestBidFromRound(currentRound);
                commit('updateHighestBidInEth', {highestBidInEth: utils.formatEther(highestBidFromRound.toString())});

                const roundFinalisedFilter = auctionContract.filters.RoundFinalised();
                roundFinalisedFilter.fromBlock = 5340852;
                roundFinalisedFilter.toBlock = "latest";
                let roundFinalisedEvents = await provider.getLogs(roundFinalisedFilter);

                roundFinalisedEvents = roundFinalisedEvents.map((event: any) => {
                    const parsedEvent = auctionContract.interface.parseLog(event);
                    return parsedEvent.values;
                }).map((event: any) => {
                    return {
                        _highestBid: utils.formatEther(event._highestBid.toString()),
                        _highestBidder: event._highestBidder.toString(),
                        _round: event._round.toString(),
                        _timestamp: event._timestamp.toString(),
                    }
                }).reverse();
                commit('updateRoundFinalisedEvents', {events: roundFinalisedEvents});
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


        getNetworkName: state => state.chainId ? getNetworkName(state.chainId): '',
        getContracts: state => state.contracts,
        getBaseUrls: state => state.baseUrls,
        auctionData: state => state.auctionData,
    }
})
