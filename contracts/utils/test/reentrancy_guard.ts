import {chaiSetup, provider, txDefaults, web3Wrapper} from '@powerchain/contracts-test-utils';
import {BlockchainLifecycle} from '@powerchain/dev-utils';
import * as chai from 'chai';

import {ReentrancyGuardRevertErrors} from '@powerchain/utils';

import {artifacts} from './artifacts';
import {TestReentrancyGuardContract} from './wrappers';

chaiSetup.configure();
const expect = chai.expect;
const blockchainLifecycle = new BlockchainLifecycle(web3Wrapper);

describe('ReentrancyGuard', () => {
    let guard: TestReentrancyGuardContract;

    before(async () => {
        await blockchainLifecycle.startAsync();
        // Deploy TestReentrancyGuard
        guard = await TestReentrancyGuardContract.deployFrompowerchainArtifactAsync(
            artifacts.TestReentrancyGuard,
            provider,
            txDefaults,
            {},
        );
    });

    after(async () => {
        await blockchainLifecycle.revertAsync();
    });

    describe('nonReentrant', () => {
        it('should revert if reentrancy occurs', async () => {
            const expectedError = new ReentrancyGuardRevertErrors.IllegalReentrancyError();
            return expect(guard.guarded(true).sendTransactionAsync()).to.revertWith(expectedError);
        });

        it('should succeed if reentrancy does not occur', async () => {
            const isSuccessful = await guard.guarded(false).callAsync();
            expect(isSuccessful).to.be.true();
        });
    });
});
