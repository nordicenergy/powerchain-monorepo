import {artifacts as assetProxyArtifacts, ERC20ProxyContract} from '@powerchain/contracts-asset-proxy';
import {DevUtilsContract} from '@powerchain/contracts-dev-utils';
import {artifacts as erc20Artifacts, DummyERC20TokenContract, ERC20TokenContract} from '@powerchain/contracts-erc20';
import {blockchainTests, chaiSetup, constants} from '@powerchain/contracts-test-utils';
import {ExchangeContractErrs} from '@powerchain/types';
import {BigNumber} from '@powerchain/utils';
import * as chai from 'chai';

import {ExchangeTransferSimulator} from './utils/exchange_transfer_simulator';
import {SimpleERC20BalanceAndProxyAllowanceFetcher} from './utils/simple_erc20_balance_and_proxy_allowance_fetcher';
import {BalanceAndProxyAllowanceLazyStore} from './utils/store/balance_and_proxy_allowance_lazy_store';
import {TradeSide, TransferType} from './utils/types';

chaiSetup.configure();
const expect = chai.expect;

const GAS_LIMIT = 9e6;

blockchainTests('ExchangeTransferSimulator', env => {
    const transferAmount = new BigNumber(5);
    let userAddresses: string[];
    let dummyERC20Token: DummyERC20TokenContract;
    let coinbase: string;
    let sender: string;
    let recipient: string;
    let exampleAssetData: string;
    let exchangeTransferSimulator: ExchangeTransferSimulator;
    let erc20ProxyAddress: string;
    const devUtils = new DevUtilsContract(constants.NULL_ADDRESS, env.provider);
    before(async function(): Promise<void> {
        const mochaTestTimeoutMs = 20000;
        this.timeout(mochaTestTimeoutMs); // tslint:disable-line:no-invalid-this

        userAddresses = await env.web3Wrapper.getAvailableAddressesAsync();
        [coinbase, sender, recipient] = userAddresses;

        const txDefaults = {
            gas: GAS_LIMIT,
            from: userAddresses[0],
        };

        await env.blockchainLifecycle.startAsync();
        const erc20Proxy = await ERC20ProxyContract.deployFrompowerchainArtifactAsync(
            assetProxyArtifacts.ERC20Proxy,
            env.provider,
            txDefaults,
            assetProxyArtifacts,
        );
        erc20ProxyAddress = erc20Proxy.address;

        const totalSupply = new BigNumber(100000000000000000000);
        const name = 'Test';
        const symbol = 'TST';
        const decimals = new BigNumber(18);
        // tslint:disable-next-line:no-unused-variable
        dummyERC20Token = await DummyERC20TokenContract.deployFrompowerchainArtifactAsync(
            erc20Artifacts.DummyERC20Token,
            env.provider,
            txDefaults,
            erc20Artifacts,
            name,
            symbol,
            decimals,
            totalSupply,
        );

        exampleAssetData = await devUtils.encodeERC20AssetData(dummyERC20Token.address).callAsync();
    });
    beforeEach(async () => {
        await env.blockchainLifecycle.startAsync();
    });
    afterEach(async () => {
        await env.blockchainLifecycle.revertAsync();
    });
    after(async () => {
        await env.blockchainLifecycle.revertAsync();
    });
    describe('#transferFromAsync', function(): void {
        // HACK: For some reason these tests need a slightly longer timeout
        const mochaTestTimeoutMs = 3000;
        this.timeout(mochaTestTimeoutMs); // tslint:disable-line:no-invalid-this
        beforeEach(() => {
            const simpleERC20BalanceAndProxyAllowanceFetcher = new SimpleERC20BalanceAndProxyAllowanceFetcher(
                (dummyERC20Token as any) as ERC20TokenContract,
                erc20ProxyAddress,
            );
            const balanceAndProxyAllowanceLazyStore = new BalanceAndProxyAllowanceLazyStore(
                simpleERC20BalanceAndProxyAllowanceFetcher,
            );
            exchangeTransferSimulator = new ExchangeTransferSimulator(balanceAndProxyAllowanceLazyStore, devUtils);
        });
        it("throws if the user doesn't have enough allowance", async () => {
            return expect(
                exchangeTransferSimulator.transferFromAsync(
                    exampleAssetData,
                    sender,
                    recipient,
                    transferAmount,
                    TradeSide.Taker,
                    TransferType.Trade,
                ),
            ).to.be.rejectedWith(ExchangeContractErrs.InsufficientTakerAllowance);
        });
        it("throws if the user doesn't have enough balance", async () => {
            await dummyERC20Token.approve(erc20ProxyAddress, transferAmount).awaitTransactionSuccessAsync({
                from: sender,
            });
            return expect(
                exchangeTransferSimulator.transferFromAsync(
                    exampleAssetData,
                    sender,
                    recipient,
                    transferAmount,
                    TradeSide.Maker,
                    TransferType.Trade,
                ),
            ).to.be.rejectedWith(ExchangeContractErrs.InsufficientMakerBalance);
        });
        it('updates balances and proxyAllowance after transfer', async () => {
            await dummyERC20Token.transfer(sender, transferAmount).awaitTransactionSuccessAsync({
                from: coinbase,
            });
            await dummyERC20Token.approve(erc20ProxyAddress, transferAmount).awaitTransactionSuccessAsync({
                from: sender,
            });

            await exchangeTransferSimulator.transferFromAsync(
                exampleAssetData,
                sender,
                recipient,
                transferAmount,
                TradeSide.Taker,
                TransferType.Trade,
            );
            const store = (exchangeTransferSimulator as any)._store;
            const senderBalance = await store.getBalanceAsync(exampleAssetData, sender);
            const recipientBalance = await store.getBalanceAsync(exampleAssetData, recipient);
            const senderProxyAllowance = await store.getProxyAllowanceAsync(exampleAssetData, sender);
            expect(senderBalance).to.be.bignumber.equal(0);
            expect(recipientBalance).to.be.bignumber.equal(transferAmount);
            expect(senderProxyAllowance).to.be.bignumber.equal(0);
        });
        it("doesn't update proxyAllowance after transfer if unlimited", async () => {
            await dummyERC20Token.transfer(sender, transferAmount).awaitTransactionSuccessAsync({
                from: coinbase,
            });
            await dummyERC20Token
                .approve(erc20ProxyAddress, constants.UNLIMITED_ALLOWANCE_IN_BASE_UNITS)
                .awaitTransactionSuccessAsync({
                    from: sender,
                });
            await exchangeTransferSimulator.transferFromAsync(
                exampleAssetData,
                sender,
                recipient,
                transferAmount,
                TradeSide.Taker,
                TransferType.Trade,
            );
            const store = (exchangeTransferSimulator as any)._store;
            const senderBalance = await store.getBalanceAsync(exampleAssetData, sender);
            const recipientBalance = await store.getBalanceAsync(exampleAssetData, recipient);
            const senderProxyAllowance = await store.getProxyAllowanceAsync(exampleAssetData, sender);
            expect(senderBalance).to.be.bignumber.equal(0);
            expect(recipientBalance).to.be.bignumber.equal(transferAmount);
            expect(senderProxyAllowance).to.be.bignumber.equal(constants.UNLIMITED_ALLOWANCE_IN_BASE_UNITS);
        });
    });
});
