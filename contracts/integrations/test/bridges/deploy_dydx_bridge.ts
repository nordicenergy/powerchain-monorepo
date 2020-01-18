import {artifacts as assetProxyArtifacts, TestDydxBridgeContract} from '@powerchain/contracts-asset-proxy';
import {BlockchainTestsEnvironment} from '@powerchain/contracts-test-utils';

import {DeploymentManager} from '../framework/deployment_manager';

/**
 * Deploys test DydxBridge contract configured to work alongside the provided `deployment`.
 */
export async function deployDydxBridgeAsync(
    deployment: DeploymentManager,
    environment: BlockchainTestsEnvironment,
): Promise<TestDydxBridgeContract> {
    const tokenHolders = deployment.accounts;
    const dydxBridge = await TestDydxBridgeContract.deployFrompowerchainArtifactAsync(
        assetProxyArtifacts.TestDydxBridge,
        environment.provider,
        deployment.txDefaults,
        assetProxyArtifacts,
        tokenHolders,
    );
    return dydxBridge;
}
