import _ from 'lodash';

function networkVersion(drizzleInstance: any) {
    const { currentProvider } = drizzleInstance.web3;
    if(currentProvider && currentProvider.networkVersion) {
        return currentProvider.networkVersion;
    }
    return 'unknown';
}

// todo: need a drizzleInstance type interface
export function getNetworkName(drizzleInstance: any): string {
    // todo: replace with blockrocket utils
    switch (networkVersion(drizzleInstance)) {
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
    const currentNetworkVersion = Number(networkVersion(drizzleInstance));
    const { networks } = truffleConf;
    if (networks[currentNetworkVersion]) {
        const { address } = networks[currentNetworkVersion];
        return address;
    }
    return '';
}

export function getEventsByName(contractInstances: any, contractName: string, eventName: string): any[] {
    const allEvents = (contractInstances[contractName].events || []);
    return allEvents.filter((event: any) => {
        return event.event === eventName;
    }).filter((event: any, index: number, self: any) => {
        // remove any duplicates
        return index == self.findIndex((obj: any) => {
            return JSON.stringify(obj) === JSON.stringify(event);
        });
    });
}

export function etherFromWei(drizzleInstance: any, wei: string): number {
    if (drizzleInstance && wei !== 'loading') {
        const utils = drizzleInstance.web3.utils;
        return utils.fromWei(wei, 'ether');
    }

    return 0;
}