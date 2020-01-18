import {ERC20Wrapper} from '@powerchain/contracts-asset-proxy';
import {DevUtilsContract} from '@powerchain/contracts-dev-utils';
import {
    blockchainTests,
    constants,
    expect,
    expectTransactionFailedAsync,
    filterLogsToArguments,
    provider,
} from '@powerchain/contracts-test-utils';
import {RevertReason} from '@powerchain/types';
import {AuthorizableRevertErrors, BigNumber, SafeMathRevertErrors, StakingRevertErrors} from '@powerchain/utils';
import {TransactionReceiptWithDecodedLogs} from 'ethereum-types';

import {constants as stakingConstants} from '../../src/constants';

import {artifacts} from '../artifacts';
import {
    NetVaultContract,
    NetVaultDepositEventArgs,
    NetVaultInCatastrophicFailureModeEventArgs,
    NetVaultNetAssetDataEventArgs,
    NetVaultStakingProxySetEventArgs,
    NetVaultWithdrawEventArgs,
} from '../wrappers';

blockchainTests.resets('NetVault unit tests', env => {
    let accounts: string[];
    let owner: string;
    let nonOwnerAddresses: string[];
    let erc20Wrapper: ERC20Wrapper;
    let NetVault: NetVaultContract;
    let netAssetData: string;
    let netAssetData: string;

    const devUtils = new DevUtilsContract(constants.NULL_ADDRESS, provider);

    before(async () => {
        // create accounts
        accounts = await env.getAccountAddressesAsync();
        [owner, ...nonOwnerAddresses] = accounts;

        // set up ERC20Wrapper
        erc20Wrapper = new ERC20Wrapper(env.provider, accounts, owner);
        // deploy erc20 proxy
        const erc20ProxyContract = await erc20Wrapper.deployProxyAsync();
        netAssetData = erc20ProxyContract.address;
        // deploy zrx token
        const [netTokenContract] = await erc20Wrapper.deployDummyTokensAsync(1, constants.DUMMY_TOKEN_DECIMALS);
        netAssetData = await devUtils.encodeERC20AssetData(netTokenContract.address).callAsync();

        await erc20Wrapper.setBalancesAndAllowancesAsync();

        zrxVault = await NetVaultContract.deployFrompowerchainArtifactAsync(
            artifacts.NetVault,
            env.provider,
            env.txDefaults,
            artifacts,
            netAssetData,
            netTokenContract.address,
        );

        await zrxVault.addAuthorizedAddress(owner).awaitTransactionSuccessAsync();

        // configure erc20 proxy to accept calls from zrx vault
        await erc20ProxyContract.addAuthorizedAddress(zrxVault.address).awaitTransactionSuccessAsync();
    });

    enum NetTransfer {
        Deposit,
        Withdrawal,
    }

    async function verifyTransferPostconditionsAsync(
        transferType: NetTransfer,
        staker: string,
        amount: BigNumber,
        initialVaultBalance: BigNumber,
        initialTokenBalance: BigNumber,
        receipt: TransactionReceiptWithDecodedLogs,
    ): Promise<void> {
        const eventArgs =
            transferType === NetTransfer.Deposit
                ? filterLogsToArguments<NetVaultDepositEventArgs>(receipt.logs, 'Deposit')
                : filterLogsToArguments<NetVaultWithdrawEventArgs>(receipt.logs, 'Withdraw');
        expect(eventArgs.length).to.equal(1);
        expect(eventArgs[0].staker).to.equal(staker);
        expect(eventArgs[0].amount).to.bignumber.equal(amount);

        const newVaultBalance = await zrxVault.balanceOf(staker).callAsync();
        const newTokenBalance = await erc20Wrapper.getBalanceAsync(staker, netAssetData);
        const [expectedVaultBalance, expectedTokenBalance] =
            transferType === NetTransfer.Deposit
                ? [initialVaultBalance.plus(amount), initialTokenBalance.minus(amount)]
                : [initialVaultBalance.minus(amount), initialTokenBalance.plus(amount)];
        expect(newVaultBalance).to.bignumber.equal(expectedVaultBalance);
        expect(newTokenBalance).to.bignumber.equal(expectedTokenBalance);
    }

    describe('Normal operation', () => {
        describe('Setting proxies', () => {
            async function verifyStakingProxySetAsync(
                receipt: TransactionReceiptWithDecodedLogs,
                newProxy: string,
            ): Promise<void> {
                const eventArgs = filterLogsToArguments<NetVaultStakingProxySetEventArgs>(
                    receipt.logs,
                    'StakingProxySet',
                );
                expect(eventArgs.length).to.equal(1);
                expect(eventArgs[0].stakingProxyAddress).to.equal(newProxy);
                const actualAddress = await zrxVault.stakingProxyAddress().callAsync();
                expect(actualAddress).to.equal(newProxy);
            }

            it('Owner can set the NET proxy', async () => {
                const newProxy = nonOwnerAddresses[0];
                const receipt = await zrxVault.setNetProxy(newProxy).awaitTransactionSuccessAsync({
                    from: owner,
                });
                const eventArgs = filterLogsToArguments<NetVaultNetAssetDataEventArgs>(receipt.logs, 'NetAssetData');
                expect(eventArgs.length).to.equal(1);
                expect(eventArgs[0].netAssetData).to.equal(newProxy);
            });
            it('Authorized address can set the NET proxy', async () => {
                const [authorized, newProxy] = nonOwnerAddresses;
                await zrxVault.addAuthorizedAddress(authorized).awaitTransactionSuccessAsync({ from: owner });
                const receipt = await zrxVault.setNetProxy(newProxy).awaitTransactionSuccessAsync({
                    from: authorized,
                });
                const eventArgs = filterLogsToArguments<NetVaultNetAssetDataEventArgs>(receipt.logs, 'NetAssetData');
                expect(eventArgs.length).to.equal(1);
                expect(eventArgs[0].netAssetData).to.equal(newProxy);
            });
            it('Non-authorized address cannot set the NET proxy', async () => {
                const [notAuthorized, newProxy] = nonOwnerAddresses;
                const tx = zrxVault.setNetProxy(newProxy).awaitTransactionSuccessAsync({
                    from: notAuthorized,
                });
                const expectedError = new AuthorizableRevertErrors.SenderNotAuthorizedError(notAuthorized);
                expect(tx).to.revertWith(expectedError);
            });
            it('Owner can set the staking proxy', async () => {
                const newProxy = nonOwnerAddresses[0];
                const receipt = await zrxVault.setStakingProxy(newProxy).awaitTransactionSuccessAsync({
                    from: owner,
                });
                await verifyStakingProxySetAsync(receipt, newProxy);
            });
            it('Authorized address can set the staking proxy', async () => {
                const [authorized, newProxy] = nonOwnerAddresses;
                await zrxVault.addAuthorizedAddress(authorized).awaitTransactionSuccessAsync({ from: owner });
                const receipt = await zrxVault.setStakingProxy(newProxy).awaitTransactionSuccessAsync({
                    from: authorized,
                });
                await verifyStakingProxySetAsync(receipt, newProxy);
            });
            it('Non-authorized address cannot set the staking proxy', async () => {
                const [notAuthorized, newProxy] = nonOwnerAddresses;
                const tx = zrxVault.setStakingProxy(newProxy).awaitTransactionSuccessAsync({
                    from: notAuthorized,
                });
                const expectedError = new AuthorizableRevertErrors.SenderNotAuthorizedError(notAuthorized);
                expect(tx).to.revertWith(expectedError);
                const actualAddress = await zrxVault.stakingProxyAddress().callAsync();
                expect(actualAddress).to.equal(stakingConstants.NIL_ADDRESS);
            });
        });
        describe('NET management', () => {
            let staker: string;
            let stakingProxy: string;
            let initialVaultBalance: BigNumber;
            let initialTokenBalance: BigNumber;

            before(async () => {
                [staker, stakingProxy] = nonOwnerAddresses;
                await zrxVault.setStakingProxy(stakingProxy).awaitTransactionSuccessAsync({ from: owner });
                await zrxVault.depositFrom(staker, new BigNumber(10)).awaitTransactionSuccessAsync({
                    from: stakingProxy,
                });
            });

            beforeEach(async () => {
                initialVaultBalance = await zrxVault.balanceOf(staker).callAsync();
                initialTokenBalance = await erc20Wrapper.getBalanceAsync(staker, netAssetData);
            });

            describe('Deposit', () => {
                it('Staking proxy can deposit zero amount on behalf of staker', async () => {
                    const receipt = await zrxVault
                        .depositFrom(staker, constants.ZERO_AMOUNT)
                        .awaitTransactionSuccessAsync({
                            from: stakingProxy,
                        });
                    await verifyTransferPostconditionsAsync(
                        NetTransfer.Deposit,
                        staker,
                        constants.ZERO_AMOUNT,
                        initialVaultBalance,
                        initialTokenBalance,
                        receipt,
                    );
                });
                it('Staking proxy can deposit nonzero amount on behalf of staker', async () => {
                    const receipt = await zrxVault.depositFrom(staker, new BigNumber(1)).awaitTransactionSuccessAsync({
                        from: stakingProxy,
                    });
                    await verifyTransferPostconditionsAsync(
                        NetTransfer.Deposit,
                        staker,
                        new BigNumber(1),
                        initialVaultBalance,
                        initialTokenBalance,
                        receipt,
                    );
                });
                it('Staking proxy can deposit entire NET balance on behalf of staker', async () => {
                    const receipt = await zrxVault
                        .depositFrom(staker, initialTokenBalance)
                        .awaitTransactionSuccessAsync({
                            from: stakingProxy,
                        });
                    await verifyTransferPostconditionsAsync(
                        NetTransfer.Deposit,
                        staker,
                        initialTokenBalance,
                        initialVaultBalance,
                        initialTokenBalance,
                        receipt,
                    );
                });
                it("Reverts if attempting to deposit more than staker's NET balance", async () => {
                    const tx = zrxVault.depositFrom(staker, initialTokenBalance.plus(1)).sendTransactionAsync({
                        from: stakingProxy,
                    });
                    expectTransactionFailedAsync(tx, RevertReason.TransferFailed);
                });
            });
            describe('Withdrawal', () => {
                it('Staking proxy can withdraw zero amount on behalf of staker', async () => {
                    const receipt = await zrxVault
                        .withdrawFrom(staker, constants.ZERO_AMOUNT)
                        .awaitTransactionSuccessAsync({
                            from: stakingProxy,
                        });
                    await verifyTransferPostconditionsAsync(
                        NetTransfer.Withdrawal,
                        staker,
                        constants.ZERO_AMOUNT,
                        initialVaultBalance,
                        initialTokenBalance,
                        receipt,
                    );
                });
                it('Staking proxy can withdraw nonzero amount on behalf of staker', async () => {
                    const receipt = await zrxVault.withdrawFrom(staker, new BigNumber(1)).awaitTransactionSuccessAsync({
                        from: stakingProxy,
                    });
                    await verifyTransferPostconditionsAsync(
                        NetTransfer.Withdrawal,
                        staker,
                        new BigNumber(1),
                        initialVaultBalance,
                        initialTokenBalance,
                        receipt,
                    );
                });
                it('Staking proxy can withdraw entire vault balance on behalf of staker', async () => {
                    const receipt = await zrxVault
                        .withdrawFrom(staker, initialVaultBalance)
                        .awaitTransactionSuccessAsync({
                            from: stakingProxy,
                        });
                    await verifyTransferPostconditionsAsync(
                        NetTransfer.Withdrawal,
                        staker,
                        initialVaultBalance,
                        initialVaultBalance,
                        initialTokenBalance,
                        receipt,
                    );
                });
                it("Reverts if attempting to withdraw more than staker's vault balance", async () => {
                    const tx = zrxVault.withdrawFrom(staker, initialVaultBalance.plus(1)).awaitTransactionSuccessAsync({
                        from: stakingProxy,
                    });
                    const expectedError = new SafeMathRevertErrors.Uint256BinOpError(
                        SafeMathRevertErrors.BinOpErrorCodes.SubtractionUnderflow,
                        initialVaultBalance,
                        initialVaultBalance.plus(1),
                    );
                    expect(tx).to.revertWith(expectedError);
                });
            });
        });
    });

    describe('Catastrophic Failure Mode', () => {
        describe('Authorization', () => {
            async function verifyCatastrophicFailureModeAsync(
                sender: string,
                receipt: TransactionReceiptWithDecodedLogs,
            ): Promise<void> {
                const eventArgs = filterLogsToArguments<NetVaultInCatastrophicFailureModeEventArgs>(
                    receipt.logs,
                    'InCatastrophicFailureMode',
                );
                expect(eventArgs.length).to.equal(1);
                expect(eventArgs[0].sender).to.equal(sender);
                expect(await zrxVault.isInCatastrophicFailure().callAsync()).to.be.true();
            }

            it('Owner can turn on Catastrophic Failure Mode', async () => {
                const receipt = await zrxVault.enterCatastrophicFailure().awaitTransactionSuccessAsync({ from: owner });
                await verifyCatastrophicFailureModeAsync(owner, receipt);
            });
            it('Authorized address can turn on Catastrophic Failure Mode', async () => {
                const authorized = nonOwnerAddresses[0];
                await zrxVault.addAuthorizedAddress(authorized).awaitTransactionSuccessAsync({ from: owner });
                const receipt = await zrxVault.enterCatastrophicFailure().awaitTransactionSuccessAsync({
                    from: authorized,
                });
                await verifyCatastrophicFailureModeAsync(authorized, receipt);
            });
            it('Non-authorized address cannot turn on Catastrophic Failure Mode', async () => {
                const notAuthorized = nonOwnerAddresses[0];
                const tx = zrxVault.enterCatastrophicFailure().awaitTransactionSuccessAsync({
                    from: notAuthorized,
                });
                const expectedError = new AuthorizableRevertErrors.SenderNotAuthorizedError(notAuthorized);
                expect(tx).to.revertWith(expectedError);
                expect(await zrxVault.isInCatastrophicFailure().callAsync()).to.be.false();
            });
            it('Catastrophic Failure Mode can only be turned on once', async () => {
                const authorized = nonOwnerAddresses[0];
                await zrxVault.addAuthorizedAddress(authorized).awaitTransactionSuccessAsync({ from: owner });
                await zrxVault.enterCatastrophicFailure().awaitTransactionSuccessAsync({
                    from: authorized,
                });
                const expectedError = new StakingRevertErrors.OnlyCallableIfNotInCatastrophicFailureError();
                return expect(zrxVault.enterCatastrophicFailure().awaitTransactionSuccessAsync()).to.revertWith(
                    expectedError,
                );
            });
        });

        describe('Affected functionality', () => {
            let staker: string;
            let stakingProxy: string;
            let initialVaultBalance: BigNumber;
            let initialTokenBalance: BigNumber;

            before(async () => {
                [staker, stakingProxy, ...nonOwnerAddresses] = nonOwnerAddresses;
                await zrxVault.setStakingProxy(stakingProxy).awaitTransactionSuccessAsync({ from: owner });
                await zrxVault.depositFrom(staker, new BigNumber(10)).awaitTransactionSuccessAsync({
                    from: stakingProxy,
                });
                await zrxVault.enterCatastrophicFailure().awaitTransactionSuccessAsync({ from: owner });
            });

            beforeEach(async () => {
                initialVaultBalance = await zrxVault.balanceOf(staker).callAsync();
                initialTokenBalance = await erc20Wrapper.getBalanceAsync(staker, netAssetData);
            });

            it('Owner cannot set the NET proxy', async () => {
                const newProxy = nonOwnerAddresses[0];
                const tx = zrxVault.setNetProxy(newProxy).awaitTransactionSuccessAsync({
                    from: owner,
                });
                const expectedError = new StakingRevertErrors.OnlyCallableIfNotInCatastrophicFailureError();
                expect(tx).to.revertWith(expectedError);
                const actualAddress = await zrxVault.netAssetProxy().callAsync();
                expect(actualAddress).to.equal(netAssetData);
            });
            it('Authorized address cannot set the NET proxy', async () => {
                const [authorized, newProxy] = nonOwnerAddresses;
                await zrxVault.addAuthorizedAddress(authorized).awaitTransactionSuccessAsync({ from: owner });
                const tx = zrxVault.setNetProxy(newProxy).awaitTransactionSuccessAsync({
                    from: authorized,
                });
                const expectedError = new StakingRevertErrors.OnlyCallableIfNotInCatastrophicFailureError();
                expect(tx).to.revertWith(expectedError);
                const actualAddress = await zrxVault.netAssetProxy().callAsync();
                expect(actualAddress).to.equal(netAssetData);
            });
            it('Staking proxy cannot deposit NET', async () => {
                const tx = zrxVault.depositFrom(staker, new BigNumber(1)).awaitTransactionSuccessAsync({
                    from: stakingProxy,
                });
                const expectedError = new StakingRevertErrors.OnlyCallableIfNotInCatastrophicFailureError();
                expect(tx).to.revertWith(expectedError);
            });

            describe('Withdrawal', () => {
                it('Staking proxy cannot call `withdrawFrom`', async () => {
                    const tx = zrxVault.withdrawFrom(staker, new BigNumber(1)).awaitTransactionSuccessAsync({
                        from: stakingProxy,
                    });
                    const expectedError = new StakingRevertErrors.OnlyCallableIfNotInCatastrophicFailureError();
                    expect(tx).to.revertWith(expectedError);
                });
                it('Staker can withdraw all their NET', async () => {
                    const receipt = await zrxVault.withdrawAllFrom(staker).awaitTransactionSuccessAsync({
                        from: staker,
                    });
                    await verifyTransferPostconditionsAsync(
                        NetTransfer.Withdrawal,
                        staker,
                        initialVaultBalance,
                        initialVaultBalance,
                        initialTokenBalance,
                        receipt,
                    );
                });
                it('Owner can withdraw NET on behalf of a staker', async () => {
                    const receipt = await zrxVault.withdrawAllFrom(staker).awaitTransactionSuccessAsync({
                        from: owner,
                    });
                    await verifyTransferPostconditionsAsync(
                        NetTransfer.Withdrawal,
                        staker,
                        initialVaultBalance,
                        initialVaultBalance,
                        initialTokenBalance,
                        receipt,
                    );
                });
                it('Non-owner address can withdraw NET on behalf of a staker', async () => {
                    const receipt = await zrxVault.withdrawAllFrom(staker).awaitTransactionSuccessAsync({
                        from: nonOwnerAddresses[0],
                    });
                    await verifyTransferPostconditionsAsync(
                        NetTransfer.Withdrawal,
                        staker,
                        initialVaultBalance,
                        initialVaultBalance,
                        initialTokenBalance,
                        receipt,
                    );
                });
            });
        });
    });
});
