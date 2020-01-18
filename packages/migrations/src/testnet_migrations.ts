import {getContractAddressesForChainOrThrow} from '@powerchain/contract-addresses';
import {
    artifacts as assetProxyArtifacts,
    ChaiBridgeContract,
    DydxBridgeContract,
    ERC20BridgeProxyContract,
    Eth2DaiBridgeContract,
    KyberBridgeContract,
    UniswapBridgeContract,
} from '@powerchain/contracts-asset-proxy';
import {artifacts as coordinatorArtifacts, CoordinatorContract} from '@powerchain/contracts-coordinator';
import {artifacts as devUtilsArtifacts, DevUtilsContract} from '@powerchain/contracts-dev-utils';
import {artifacts as exchangeArtifacts, ExchangeContract} from '@powerchain/contracts-exchange';
import {artifacts as forwarderArtifacts, ForwarderContract} from '@powerchain/contracts-exchange-forwarder';
import {
    artifacts as multisigArtifacts,
    ZeroExGovernorContract,
    ZeroExGovernorSubmissionEventArgs,
} from '@powerchain/contracts-multisig';
import {
    artifacts as stakingArtifacts,
    NetVaultContract,
    StakingContract,
    StakingProxyContract,
} from '@powerchain/contracts-staking';
import {IAuthorizableContract, IOwnableContract} from '@powerchain/contracts-utils';
import {AbiEncoder, BigNumber, logUtils, providerUtils} from '@powerchain/utils';
import {LogWithDecodedArgs, SupportedProvider, TxData} from 'ethereum-types';

import {getConfigsByChainId} from './utils/configs_by_chain';
import {constants} from './utils/constants';
import {providerFactory} from './utils/provider_factory';
import {getTimelockRegistrationsByChainId} from './utils/timelocks';

async function submitAndExecuteTransactionAsync(
    governor: ZeroExGovernorContract,
    destination: string,
    data: string,
): Promise<void> {
    const { logs } = await governor
        .submitTransaction(destination, constants.ZERO_AMOUNT, data)
        .awaitTransactionSuccessAsync();
    // tslint:disable-next-line:no-unnecessary-type-assertion
    const txId = (logs[0] as LogWithDecodedArgs<ZeroExGovernorSubmissionEventArgs>).args.transactionId;
    logUtils.log(`${txId} submitted`);
    await governor.executeTransaction(txId).awaitTransactionSuccessAsync();
    logUtils.log(`${txId} executed`);
}

/**
 * Deploys all 3.0 contracts and reconfigures existing 2.0 contracts.
 * @param supportedProvider  Web3 provider instance. Your provider instance should connect to the testnet you want to deploy to.
 * @param txDefaults Default transaction values to use when deploying contracts (e.g., specify the desired contract creator with the `from` parameter).
 */
export async function runMigrationsAsync(supportedProvider: SupportedProvider, txDefaults: TxData): Promise<void> {
    const provider = providerUtils.standardizeOrThrow(supportedProvider);
    const chainId = new BigNumber(await providerUtils.getChainIdAsync(provider));
    const deployedAddresses = getContractAddressesForChainOrThrow(chainId.toNumber());
    const configs = getConfigsByChainId(chainId.toNumber());

    // NOTE: This must be deployed before running these migrations, since its address is hard coded in the
    // staking logic contract.
    const zrxVault = new NetVaultContract(deployedAddresses.zrxVault, provider, txDefaults);

    const stakingLogic = await StakingContract.deployFrompowerchainArtifactAsync(
        stakingArtifacts.Staking,
        provider,
        txDefaults,
        stakingArtifacts,
    );

    const exchange = await ExchangeContract.deployFrompowerchainArtifactAsync(
        exchangeArtifacts.Exchange,
        provider,
        txDefaults,
        exchangeArtifacts,
        chainId,
    );

    const stakingProxy = await StakingProxyContract.deployFrompowerchainArtifactAsync(
        stakingArtifacts.StakingProxy,
        provider,
        txDefaults,
        stakingArtifacts,
        stakingLogic.address,
    );

    const erc20BridgeProxy = await ERC20BridgeProxyContract.deployFrompowerchainArtifactAsync(
        assetProxyArtifacts.ERC20BridgeProxy,
        provider,
        txDefaults,
        assetProxyArtifacts,
    );

    await UniswapBridgeContract.deployFrompowerchainArtifactAsync(
        assetProxyArtifacts.UniswapBridge,
        provider,
        txDefaults,
        assetProxyArtifacts,
    );

    await Eth2DaiBridgeContract.deployFrompowerchainArtifactAsync(
        assetProxyArtifacts.Eth2DaiBridge,
        provider,
        txDefaults,
        assetProxyArtifacts,
    );

    await KyberBridgeContract.deployFrompowerchainArtifactAsync(
        assetProxyArtifacts.KyberBridge,
        provider,
        txDefaults,
        assetProxyArtifacts,
    );

    const chaiBridge = await ChaiBridgeContract.deployFrompowerchainArtifactAsync(
        assetProxyArtifacts.ChaiBridge,
        provider,
        txDefaults,
        assetProxyArtifacts,
    );

    await DydxBridgeContract.deployFrompowerchainArtifactAsync(
        assetProxyArtifacts.DydxBridge,
        provider,
        txDefaults,
        assetProxyArtifacts,
    );

    const authorizableInterface = new IAuthorizableContract(constants.NULL_ADDRESS, provider, txDefaults);
    const ownableInterface = new IOwnableContract(constants.NULL_ADDRESS, provider, txDefaults);

    const customTimeLocks = getTimelockRegistrationsByChainId(chainId.toNumber());

    const governor = await ZeroExGovernorContract.deployFrompowerchainArtifactAsync(
        multisigArtifacts.ZeroExGovernor,
        provider,
        txDefaults,
        multisigArtifacts,
        customTimeLocks.map(timeLockInfo => timeLockInfo.functionSelector),
        customTimeLocks.map(timeLockInfo => timeLockInfo.destination),
        customTimeLocks.map(timeLockInfo => timeLockInfo.secondsTimeLocked),
        configs.zeroExGovernor.owners,
        configs.zeroExGovernor.required,
        configs.zeroExGovernor.secondsTimeLocked,
    );

    logUtils.log('Configuring Exchange...');
    await exchange.setProtocolFeeCollectorAddress(stakingProxy.address).awaitTransactionSuccessAsync();
    await exchange.setProtocolFeeMultiplier(new BigNumber(150000)).awaitTransactionSuccessAsync();
    await exchange.registerAssetProxy(deployedAddresses.erc20Proxy).awaitTransactionSuccessAsync();
    await exchange.registerAssetProxy(deployedAddresses.erc721Proxy).awaitTransactionSuccessAsync();
    await exchange.registerAssetProxy(deployedAddresses.erc1155Proxy).awaitTransactionSuccessAsync();
    await exchange.registerAssetProxy(deployedAddresses.multiAssetProxy).awaitTransactionSuccessAsync();
    await exchange.registerAssetProxy(deployedAddresses.staticCallProxy).awaitTransactionSuccessAsync();
    await exchange.registerAssetProxy(erc20BridgeProxy.address).awaitTransactionSuccessAsync();
    await exchange.transferOwnership(governor.address).awaitTransactionSuccessAsync();
    logUtils.log('Exchange configured!');

    logUtils.log('Configuring ERC20BridgeProxy...');
    await erc20BridgeProxy.addAuthorizedAddress(exchange.address).awaitTransactionSuccessAsync();
    await erc20BridgeProxy.addAuthorizedAddress(deployedAddresses.multiAssetProxy).awaitTransactionSuccessAsync();
    await erc20BridgeProxy.transferOwnership(governor.address).awaitTransactionSuccessAsync();
    logUtils.log('ERC20BridgeProxy configured!');

    logUtils.log('Configuring NetVault...');
    await zrxVault.addAuthorizedAddress(txDefaults.from).awaitTransactionSuccessAsync();
    await zrxVault.setStakingProxy(stakingProxy.address).awaitTransactionSuccessAsync();
    await zrxVault.removeAuthorizedAddress(txDefaults.from).awaitTransactionSuccessAsync();
    await zrxVault.addAuthorizedAddress(governor.address).awaitTransactionSuccessAsync();
    await zrxVault.transferOwnership(governor.address).awaitTransactionSuccessAsync();
    logUtils.log('NetVault configured!');

    logUtils.log('Configuring StakingProxy...');
    await stakingProxy.addAuthorizedAddress(txDefaults.from).awaitTransactionSuccessAsync();
    const staking = new StakingContract(stakingProxy.address, provider, txDefaults);
    await staking.addExchangeAddress(exchange.address).awaitTransactionSuccessAsync();
    await stakingProxy.removeAuthorizedAddress(txDefaults.from).awaitTransactionSuccessAsync();
    await stakingProxy.addAuthorizedAddress(governor.address).awaitTransactionSuccessAsync();
    await stakingProxy.transferOwnership(governor.address).awaitTransactionSuccessAsync();
    logUtils.log('StakingProxy configured!');

    logUtils.log('Transfering ownership of 2.0 contracts...');
    const oldAssetProxyOwner = new ZeroExGovernorContract(deployedAddresses.assetProxyOwner, provider, txDefaults);
    await submitAndExecuteTransactionAsync(
        oldAssetProxyOwner,
        deployedAddresses.exchangeV2, // Exchange 2.1 address
        ownableInterface.transferOwnership(governor.address).getABIEncodedTransactionData(),
    );
    await submitAndExecuteTransactionAsync(
        oldAssetProxyOwner,
        deployedAddresses.erc20Proxy,
        ownableInterface.transferOwnership(governor.address).getABIEncodedTransactionData(),
    );
    await submitAndExecuteTransactionAsync(
        oldAssetProxyOwner,
        deployedAddresses.erc721Proxy,
        ownableInterface.transferOwnership(governor.address).getABIEncodedTransactionData(),
    );
    await submitAndExecuteTransactionAsync(
        oldAssetProxyOwner,
        deployedAddresses.erc1155Proxy,
        ownableInterface.transferOwnership(governor.address).getABIEncodedTransactionData(),
    );
    await submitAndExecuteTransactionAsync(
        oldAssetProxyOwner,
        deployedAddresses.multiAssetProxy,
        ownableInterface.transferOwnership(governor.address).getABIEncodedTransactionData(),
    );
    logUtils.log('Ownership transferred!');

    const functionCalls = [
        // AssetProxy configs
        {
            destination: deployedAddresses.erc20Proxy,
            data: authorizableInterface.addAuthorizedAddress(exchange.address).getABIEncodedTransactionData(),
        },
        {
            destination: deployedAddresses.erc20Proxy,
            data: authorizableInterface.addAuthorizedAddress(zrxVault.address).getABIEncodedTransactionData(),
        },
        {
            destination: deployedAddresses.erc721Proxy,
            data: authorizableInterface.addAuthorizedAddress(exchange.address).getABIEncodedTransactionData(),
        },
        {
            destination: deployedAddresses.erc1155Proxy,
            data: authorizableInterface.addAuthorizedAddress(exchange.address).getABIEncodedTransactionData(),
        },
        {
            destination: deployedAddresses.multiAssetProxy,
            data: authorizableInterface.addAuthorizedAddress(exchange.address).getABIEncodedTransactionData(),
        },
        {
            destination: deployedAddresses.multiAssetProxy,
            data: exchange.registerAssetProxy(erc20BridgeProxy.address).getABIEncodedTransactionData(),
        },
    ];

    const batchTransactionEncoder = AbiEncoder.create('(bytes[],address[],uint256[])');
    const batchTransactionData = batchTransactionEncoder.encode([
        functionCalls.map(item => item.data),
        functionCalls.map(item => item.destination),
        functionCalls.map(() => constants.ZERO_AMOUNT),
    ]);
    await submitAndExecuteTransactionAsync(governor, governor.address, batchTransactionData);

    await DevUtilsContract.deployFrompowerchainArtifactAsync(
        devUtilsArtifacts.DevUtils,
        provider,
        txDefaults,
        devUtilsArtifacts,
        exchange.address,
        chaiBridge.address,
    );

    await CoordinatorContract.deployFrompowerchainArtifactAsync(
        coordinatorArtifacts.Coordinator,
        provider,
        txDefaults,
        coordinatorArtifacts,
        exchange.address,
        chainId,
    );

    await ForwarderContract.deployFrompowerchainArtifactAsync(
        forwarderArtifacts.Forwarder,
        provider,
        txDefaults,
        forwarderArtifacts,
        exchange.address,
        deployedAddresses.exchangeV2,
        deployedAddresses.etherToken,
    );
}

(async () => {
    const networkId = 1;
    const rpcUrl = 'https://mainnet.infura.io/v3/';
    const provider = await providerFactory.getLedgerProviderAsync(networkId, rpcUrl);
    await runMigrationsAsync(provider, { from: 'powerchain3b39078f2a3e1512eecc8d6792fdc7f33e1cd2cf', gasPrice: 10000000001 });
})().catch(err => {
    logUtils.log(err);
    process.exit(1);
});
