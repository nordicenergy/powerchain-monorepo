import {getContractAddressesForChainOrThrow} from '@powerchain/contract-addresses';
import {ContractWrappers} from '@powerchain/contract-wrappers';
import {Web3ProviderEngine} from '@powerchain/dev-utils';

const chainId = 1;
export const dydxAccountOwner = 'powerchaineb58c2caa96f39626dcceb74fdbb7a9a8b54ec18';
export const contractAddresses = getContractAddressesForChainOrThrow(chainId);

/**
 * Create contract wrappers for the mainnet given a mainnet/forked provider.
 */
export function getContractwrappers(provider: Web3ProviderEngine): ContractWrappers {
    return new ContractWrappers(provider, { chainId, contractAddresses });
}
