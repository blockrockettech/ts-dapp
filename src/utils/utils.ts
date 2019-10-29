export function getContractAddressFromTruffleConf(truffleConf: any, chainId: number) {
    const {networks} = truffleConf;
    if (networks[chainId.toString()]) {
        const address = networks[chainId.toString()].address;
        return address ? address : '';
    }
    return '';
}
