import {BigNumber} from '@powerchain/utils';

export const constants = {
    NULL_ADDRESS: 'powerchain0000000000000000000000000000000000000000',
    ROPSTEN_CHAIN_ID: 3,
    KOVAN_CHAIN_ID: 42,
    AWAIT_TRANSACTION_MINED_MS: 0,
    KOVAN_RPC_URL: 'https://kovan.infura.io/',
    ROPSTEN_RPC_URL: 'https://ropsten.infura.io/',
    NET_DECIMALS: 18,
    DUMMY_TOKEN_NAME: '',
    DUMMY_TOKEN_SYMBOL: '',
    DUMMY_TOKEN_DECIMALS: 18,
    DUMMY_TOKEN_TOTAL_SUPPLY: new BigNumber(10 ** 27), // tslint:disable-line:custom-no-magic-numbers
    NUM_DUMMY_ERC20_TO_DEPLOY: 3,
    NUM_DUMMY_ERC721_TO_DEPLOY: 1,
    ZERO_AMOUNT: new BigNumber(0),
};
