import Vue from 'vue'
import Vuex from 'vuex'
import deployedBlock from '@/truffleconf/auction/deployment';
import {ethers, utils} from 'ethers';
import {getNetworkName} from '@blockrocket/utils';
import {getContractAddressFromTruffleConf, getDomain, fetchEvents} from '@/utils/utils';

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
        accounts: null,
        account: null,
        auctionData: {
            currentRound: {
                roundNumber: null,
                highestBidInEth: null,
                highestBidder: null,
                paramFromHighestBidder: null,
            },
            totalRounds: null,
            roundLengthInSeconds: null,
            auctionStartTime: null,
            minBid: null,
            events: {
                roundFinalised: null,
                bidAcceptedForCurrentRound: null,
            }
        }
    },
    mutations: {
        updateWeb3Objects(state, {provider, signer, chainId, contracts, baseUrls, accounts, account}) {
            Vue.set(state, 'provider', provider);
            Vue.set(state, 'signer', signer);
            Vue.set(state, 'chainId', chainId);
            Vue.set(state, 'contracts', contracts);
            Vue.set(state, 'baseUrls', baseUrls);
            Vue.set(state, 'accounts', accounts);
            Vue.set(state, 'account', account);
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
        updateBidAcceptedEvents(state, {events}) {
            Vue.set(state.auctionData.events, 'bidAcceptedForCurrentRound', events);
        },
        updateHighestBidderFromRound(state, {highestBidderFromRound}) {
            Vue.set(state.auctionData.currentRound, 'highestBidder', highestBidderFromRound);
        },
    },
    actions: {
        async bootstrapWeb3({ commit, dispatch }, { provider, signer, chainId }) {
            const accounts = await provider.listAccounts();
            const account = accounts && accounts.length ? accounts[0] : null;

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

            commit('updateWeb3Objects', {provider, signer, chainId, contracts, baseUrls, accounts, account});
            dispatch('fetchCoreData', {provider, contracts, network});
        },
        async fetchCoreData({ commit, dispatch }, {provider, contracts, network}) {
            const auctionContract = contracts['TwistedSisterAuction'];
            if (auctionContract) {
                dispatch('fetchCurrentRoundNumberAndAssociatedData', {auctionContract, provider, network});
                dispatch('fetchNumberOfRounds', auctionContract);
                dispatch('fetchRoundLength', auctionContract);
                dispatch('fetchAuctionStartTime', auctionContract);
                dispatch('fetchMinBid', auctionContract);
                dispatch('fetchRoundFinalisedEvents', {auctionContract, provider, network});
            }
        },
        async fetchCurrentRoundNumberAndAssociatedData({ commit, dispatch }, {auctionContract, provider, network}) {
            const currentRound = await auctionContract.currentRound();
            commit('updateCurrentRound', {currentRound: currentRound.toString()});

            dispatch('fetchBidAcceptedEventsForCurrentRound', {
                auctionContract,
                provider,
                network,
                roundNo: currentRound.toString()
            });

            dispatch('fetchHighestBidderInfo', {auctionContract, currentRoundNumber: currentRound});
        },
        async fetchHighestBidderInfo({ commit, dispatch }, context) {
            dispatch('fetchHighestBidForRound', context);
            dispatch('fetchHighestBidderForRound', context);
            dispatch('fetchParamFromHighestBidder', context);
        },
        async fetchHighestBidForRound({ commit }, {auctionContract, currentRoundNumber}) {
            const highestBidFromRound = await auctionContract.highestBidFromRound(currentRoundNumber);
            commit('updateHighestBidInEth', {highestBidInEth: utils.formatEther(highestBidFromRound.toString())});
        },
        async fetchHighestBidderForRound({ commit }, {auctionContract, currentRoundNumber}) {
            const highestBidderFromRound = await auctionContract.highestBidderFromRound(currentRoundNumber);
            commit('updateHighestBidderFromRound', {highestBidderFromRound});
        },
        async fetchParamFromHighestBidder({ commit }, {auctionContract, currentRoundNumber}) {
            const winningRoundParam = await auctionContract.winningRoundParameter(currentRoundNumber);
            commit('updateParamFromHighestBidder', {param: winningRoundParam});
        },
        async fetchNumberOfRounds({ commit }, auctionContract) {
            const numOfRounds = await auctionContract.numOfRounds();
            commit('updateTotalRounds', {totalRounds: numOfRounds.toString()});
        },
        async fetchRoundLength({ commit }, auctionContract) {
            const roundLengthInSeconds = await auctionContract.roundLengthInSeconds();
            commit('updateRoundLengthInSeconds', {roundLengthInSeconds: roundLengthInSeconds.toString()});
        },
        async fetchAuctionStartTime({ commit }, auctionContract) {
            const auctionStartTime = await auctionContract.auctionStartTime();
            commit('updateAuctionStartTime', {auctionStartTime: auctionStartTime.toString()});
        },
        async fetchMinBid({ commit }, auctionContract) {
            const minBid = await auctionContract.minBid();
            commit('updateMinBid', {minBid: minBid.toString()});
        },
        async fetchRoundFinalisedEvents({ commit }, {auctionContract, provider, network}) {
            const events = (await fetchEvents(
                    'RoundFinalised',
                    auctionContract,
                    provider,
                    deployedBlock(network))
            ).map((event: any) => {
                // This is only a subset of all fields
                return {
                    _highestBid: utils.formatEther(event._highestBid.toString()),
                    _highestBidder: event._highestBidder.toString(),
                    _round: event._round.toString(),
                    _timestamp: event._timestamp.toString(),
                    _param: event._param.toString(),
                }
            }).reverse();

            commit('updateRoundFinalisedEvents', {events});
        },
        async fetchBidAcceptedEventsForCurrentRound({ commit }, {auctionContract, provider, network, roundNo}) {
            const events = (await fetchEvents(
                    'BidAccepted',
                    auctionContract,
                    provider,
                    deployedBlock(network))
            ).map((event: any) => {
                // This is only a subset of all fields
                return {
                    _timeStamp: event._timeStamp.toString(),
                    _amount: utils.formatEther(event._amount.toString()),
                    _bidder: event._bidder.toString(),
                    _round: event._round.toString()
                };
            })
            .reverse()
            .filter((event: any) => event._round === roundNo);

            commit('updateBidAcceptedEvents', {events});
        },
    },
    getters: {
        networkName: state => state.chainId ? getNetworkName(state.chainId): '',
        contracts: state => state.contracts,
        baseUrls: state => state.baseUrls,
        auctionData: state => state.auctionData,
        events: state => state.auctionData.events,
        account: state => state.account,
    }
})
