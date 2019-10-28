import TwistedSisterAuction from "@/truffleconf/auction/TwistedSisterAuction.json";

const options = {
    web3: {
        block: false,
        fallback: {
            type: 'ws',
            url: 'ws://127.0.0.1:9545'
        }
    },

    // The contracts to monitor
    contracts: [TwistedSisterAuction],
    events: {
        // monitor SimpleStorage.StorageSet events
        TwistedAuctionMock: [
            {
                eventName: 'BidAccepted',
                eventOptions: { fromBlock: 0 }
            },
            {
                eventName: 'RoundFinalised',
                eventOptions: { fromBlock: 0 }
            }
        ]
    },
    polls: {
        // check accounts every 5 seconds
        accounts: 5000
    }
};

export default options;
