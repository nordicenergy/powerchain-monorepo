import {devConstants, web3Factory} from '@powerchain/dev-utils';
import {Web3ProviderEngine} from '@powerchain/subproviders';
import {Web3Wrapper} from '@powerchain/web3-wrapper';

const txDefaults = {
    from: devConstants.TESTRPC_FIRST_ADDRESS,
    gas: devConstants.GAS_LIMIT,
};
const provider: Web3ProviderEngine = web3Factory.getRpcProvider({ shouldUseInProcessGanache: true });
const web3Wrapper = new Web3Wrapper(provider);

export { provider, web3Wrapper, txDefaults };
