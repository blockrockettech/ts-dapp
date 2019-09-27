import _ from 'lodash';

// todo: need a drizzleInstance type interface
export function getNetworkName(drizzleInstance: any): string {
    const currentProvider = drizzleInstance.web3.currentProvider;

    if(currentProvider && currentProvider.networkVersion) {
        // todo: replace with proper import of blockrocket-utils
        switch (currentProvider.networkVersion) {
            case 1:
            case '1':
            case 'mainnet':
                return 'mainnet';
            case 3:
            case '3':
            case 'ropsten':
                return 'ropsten';
            case 4:
            case '4':
            case 'rinkeby':
                return 'rinkeby';
            case 5777:
            case '5777':
            case 'local':
                // This may change if a clean deploy of KODA locally is not done
                return 'local';
            default:
                return 'unknown';
        }
    } else {
        return 'unknown';
    }
}

export function getEtherscanBaseUrl(drizzleInstance: any): string {
    const network = getNetworkName(drizzleInstance);
    const testnetIntersect = _.intersection([network], ['ropsten', 'rinkeby']);
    return testnetIntersect.length > 0 ? `https://${network}.etherscan.io` : 'https://etherscan.io';
}