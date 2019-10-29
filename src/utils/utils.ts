import _ from 'lodash';

export function getContractAddressFromTruffleConf(truffleConf: any, chainId: number) {
    const {networks} = truffleConf;
    if (networks[chainId.toString()]) {
        const address = networks[chainId.toString()].address;
        return address ? address : '';
    }
    return '';
}

export function getDomain(network: string, root: string) {
    return _.intersection([network], ['ropsten', 'rinkeby']).length > 0 ?
        `https://${network}.${root}.io` : `https://${root}.io`;
}
