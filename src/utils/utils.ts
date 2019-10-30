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

export async function fetchEvents(eventName: string, contract: any, provider: any, fromBlock: number) {
    const eventFilter = contract.filters[eventName]();
    eventFilter.fromBlock = fromBlock;
    eventFilter.toBlock = "latest";

    let events = (await provider.getLogs(eventFilter)) || [];
    return events.map((event: any) => {
        const parsedEvent = contract.interface.parseLog(event);
        return parsedEvent.values;
    });
}