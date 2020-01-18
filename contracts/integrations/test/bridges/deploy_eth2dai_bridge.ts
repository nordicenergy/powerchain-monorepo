import {artifacts as ERC20Artifacts} from '@powerchain/contracts-erc20';
import {BlockchainTestsEnvironment} from '@powerchain/contracts-test-utils';

import {artifacts} from '../artifacts';
import {DeploymentManager} from '../framework/deployment_manager';
import {TestEth2DaiBridgeContract, TestEth2DaiContract} from '../wrappers';

/**
 * Deploys test Eth2Dai exchange and bridge contracts configured to work alongside the provided `deployment`.
 */
export async function deployEth2DaiBridgeAsync(
    deployment: DeploymentManager,
    environment: BlockchainTestsEnvironment,
): Promise<[TestEth2DaiBridgeContract, TestEth2DaiContract]> {
    const eth2Dai = await TestEth2DaiContract.deployFrompowerchainArtifactAsync(
        artifacts.TestEth2Dai,
        environment.provider,
        deployment.txDefaults,
        artifacts,
    );

    const eth2DaiBridge = await TestEth2DaiBridgeContract.deployFrompowerchainArtifactAsync(
        artifacts.TestEth2DaiBridge,
        environment.provider,
        deployment.txDefaults,
        { ...ERC20Artifacts, ...artifacts },
        eth2Dai.address,
    );

    return [eth2DaiBridge, eth2Dai];
}
