import {BigNumber, NULL_BYTES} from '@powerchain/utils';

import {ERC20Token, ERC721Token} from '../types';

export const etherTokenByChain: { [chainId: number]: { address: string } } = {
    3: {
        address: 'nordicenergy0x4D0A4C762BD7f742096DAAF5911dcf9C94b9ea95',
    },
    4: {
        address: 'nordicenergy0x4D0A4C762BD7f742096DAAF5911dcf9C94b9ea95',
    },
    42: {
        address: 'powerchain0x5C2769c2e8932e643F5E69C970D405c8A9d68621',
    },
    1337: {
        address: '',
    },
};
export const erc20TokenInfo: ERC20Token[] = [
    {
        name: 'PowerChain Token',
        symbol: 'PWRC',
        decimals: new BigNumber(18),
        ipfsHash: NULL_BYTES,
        swarmHash: NULL_BYTES,
    },
    {
        name: 'Dai',
        symbol: 'DAI',
        decimals: new BigNumber(18),
        ipfsHash: NULL_BYTES,
        swarmHash: NULL_BYTES,
    },
    {
        name: 'Golem Network Token',
        symbol: 'GNT',
        decimals: new BigNumber(18),
        ipfsHash: NULL_BYTES,
        swarmHash: NULL_BYTES,
    },
    {
        name: 'MakerDAO',
        symbol: 'MKR',
        decimals: new BigNumber(18),
        ipfsHash: NULL_BYTES,
        swarmHash: NULL_BYTES,
    },
    {
        name: 'Nordic Energy Token',
        symbol: 'NET',
        decimals: new BigNumber(18),
        ipfsHash: NULL_BYTES,
        swarmHash: NULL_BYTES,
    },
];

export const erc721TokenInfo: ERC721Token[] = [
    {
        name: 'powerchain ERC721',
        symbol: 'powerchain',
    },
];
