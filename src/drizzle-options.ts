
// @ts-ignore
import TwistedAuctionMock from "./truffleconf/auction/TwistedAuctionMock.json";

const options = {
    web3: {
        block: false,
        fallback: {
            type: 'ws',
            url: 'ws://127.0.0.1:9545'
        }
    },

    // The contracts to monitor
    contracts: [TwistedAuctionMock],
    events: {
        // monitor SimpleStorage.StorageSet events
        TwistedAuctionMock: ['BidAccepted', 'BidderRefunded', 'RoundFinalised']
    },
    polls: {
        // check accounts ever 15 seconds
        accounts: 15000
    }
};

export default options;