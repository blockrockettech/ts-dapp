import _ from 'lodash';

function networkVersion(currentProvider: any) {
    if(currentProvider && currentProvider.networkVersion) {
        return currentProvider.networkVersion;
    }
    return 'unknown';
}

// todo: need a drizzleInstance type interface
export function getNetworkName(drizzleInstance: any): string {
    const { currentProvider } = drizzleInstance.web3;

    // todo: replace with blockrocket utils
    switch (networkVersion(currentProvider)) {
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
            return 'local';
        default:
            return 'unknown';
    }
}

export function getEtherscanBaseUrl(drizzleInstance: any): string {
    const network = getNetworkName(drizzleInstance);
    return _.intersection([network], ['ropsten', 'rinkeby']).length > 0 ?
        `https://${network}.etherscan.io` : 'https://etherscan.io';
}

export function getContractAddressFromTruffleConf(drizzleInstance: any, truffleConf: any): string {
    const { currentProvider } = drizzleInstance.web3;
    const currentNetworkVersion = Number(networkVersion(currentProvider));
    const networksTruffleConf = truffleConf.networks;
    if (networksTruffleConf[currentNetworkVersion]) {
        const { address } = networksTruffleConf[currentNetworkVersion];
        return address;
    }
    return '';
}