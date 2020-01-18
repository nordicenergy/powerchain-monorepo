import {artifacts as ERC20Artifacts} from '@powerchain/contracts-erc20';
import {BlockchainTestsEnvironment} from '@powerchain/contracts-test-utils';

import {artifacts} from '../artifacts';
import {DeploymentManager} from '../framework/deployment_manager';
import {TestUniswapBridgeContract, TestUniswapExchangeContract, TestUniswapExchangeFactoryContract,} from '../wrappers';

/**
 * Deploys test Uniswap exchanges for the given tokens, a test UniswapExchangeFactory, and a test
 * bridge contract configured to work alongside the provided `deployment`.
 */
export async function deployUniswapBridgeAsync(
    deployment: DeploymentManager,
    environment: BlockchainTestsEnvironment,
    tokenAddresses: string[],
): Promise<[TestUniswapBridgeContract, TestUniswapExchangeContract[], TestUniswapExchangeFactoryContract]> {
    const uniswapExchangeFactory = await TestUniswapExchangeFactoryContract.deployFrompowerchainArtifactAsync(
        artifacts.TestUniswapExchangeFactory,
        environment.provider,
        deployment.txDefaults,
        artifacts,
    );

    const uniswapExchanges = [];
    for (const tokenAddress of tokenAddresses) {
        const uniswapExchange = await TestUniswapExchangeContract.deployFrompowerchainArtifactAsync(
            artifacts.TestUniswapExchange,
            environment.provider,
            deployment.txDefaults,
            artifacts,
            tokenAddress,
        );
        await uniswapExchangeFactory.addExchange(tokenAddress, uniswapExchange.address).awaitTransactionSuccessAsync();
        uniswapExchanges.push(uniswapExchange);
    }

    const uniswapBridge = await TestUniswapBridgeContract.deployFrompowerchainArtifactAsync(
        artifacts.TestUniswapBridge,
        environment.provider,
        deployment.txDefaults,
        { ...ERC20Artifacts, ...artifacts },
        deployment.tokens.weth.address,
        uniswapExchangeFactory.address,
    );

    return [uniswapBridge, uniswapExchanges, uniswapExchangeFactory];
}
