import {artifacts, CoordinatorContract} from '@powerchain/contracts-coordinator';
import {artifacts as exchangeArtifacts} from '@powerchain/contracts-exchange';
import {BlockchainTestsEnvironment} from '@powerchain/contracts-test-utils';
import {BigNumber} from '@powerchain/utils';

import {DeploymentManager} from '../framework/deployment_manager';

/**
 * Deploys a Coordinator contract configured to work alongside the provided `deployment`.
 */
export async function deployCoordinatorAsync(
    deployment: DeploymentManager,
    environment: BlockchainTestsEnvironment,
): Promise<CoordinatorContract> {
    return CoordinatorContract.deployFrompowerchainArtifactAsync(
        artifacts.Coordinator,
        environment.provider,
        deployment.txDefaults,
        { ...exchangeArtifacts, ...artifacts },
        deployment.exchange.address,
        new BigNumber(deployment.chainId),
    );
}
