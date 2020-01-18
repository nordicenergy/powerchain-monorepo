import {web3Factory} from '@powerchain/dev-utils';
import {Web3ProviderEngine} from '@powerchain/subproviders';
import {Web3Wrapper} from '@powerchain/web3-wrapper';

const provider: Web3ProviderEngine = web3Factory.getRpcProvider({ shouldUseInProcessGanache: true });
const web3Wrapper = new Web3Wrapper(provider);

export { provider, web3Wrapper };
