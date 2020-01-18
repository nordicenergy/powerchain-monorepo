import {artifacts as exchangeArtifacts} from '@powerchain/contracts-exchange';
import {artifacts, ForwarderContract} from '@powerchain/contracts-exchange-forwarder';
import {BlockchainTestsEnvironment, constants} from '@powerchain/contracts-test-utils';

import {DeploymentManager} from '../framework/deployment_manager';

/**
 * Deploys a Forwarder contract configured to work alongside the provided `deployment`.
 */
export async function deployForwarderAsync(
    deployment: DeploymentManager,
    environment: BlockchainTestsEnvironment,
): Promise<ForwarderContract> {
    return ForwarderContract.deployFrompowerchainArtifactAsync(
        artifacts.Forwarder,
        environment.provider,
        deployment.txDefaults,
        { ...exchangeArtifacts, ...artifacts },
        deployment.exchange.address,
        constants.NULL_ADDRESS, // ExchangeV2 not tested on Ganache
        deployment.tokens.weth.address,
    );
}
