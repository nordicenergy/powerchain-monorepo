import {BigNumber} from '@powerchain/utils';

export interface ERC20Token {
    address?: string;
    name: string;
    symbol: string;
    decimals: BigNumber;
    ipfsHash: string;
    swarmHash: string;
}

export interface ERC721Token {
    name: string;
    symbol: string;
}

export enum ContractName {
    TokenTransferProxy = 'TokenTransferProxy',
    TokenRegistry = 'TokenRegistry',
    MultiSigWalletWithTimeLock = 'MultiSigWalletWithTimeLock',
    Exchange = 'Exchange',
    NETToken = 'NETToken',
    DummyToken = 'DummyToken',
    WETH9 = 'WETH9',
    MultiSigWalletWithTimeLockExceptRemoveAuthorizedAddress = 'MultiSigWalletWithTimeLockExceptRemoveAuthorizedAddress',
    AccountLevels = 'AccountLevels',
    EtherDelta = 'EtherDelta',
    Arbitrage = 'Arbitrage',
}
