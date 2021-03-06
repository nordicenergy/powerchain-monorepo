import {
    blockchainTests,
    constants,
    expect,
    randomAddress,
    transactionHashUtils
} from '@powerchain/contracts-test-utils';
import {BigNumber} from '@powerchain/utils';

import {hashUtils} from '../src/hash_utils';

import {artifacts} from './artifacts';

import {CoordinatorContract} from './wrappers';

blockchainTests.resets('Libs tests', env => {
    let coordinatorContract: CoordinatorContract;
    let chainId: number;
    const exchangeAddress = randomAddress();

    before(async () => {
        chainId = await env.getChainIdAsync();
        coordinatorContract = await CoordinatorContract.deployFrompowerchainArtifactAsync(
            artifacts.Coordinator,
            env.provider,
            env.txDefaults,
            artifacts,
            exchangeAddress,
            new BigNumber(chainId),
        );
    });

    describe('getApprovalHash', () => {
        it('should return the correct approval hash', async () => {
            const signedTx = {
                salt: constants.ZERO_AMOUNT,
                gasPrice: constants.ZERO_AMOUNT,
                expirationTimeSeconds: constants.ZERO_AMOUNT,
                signerAddress: constants.NULL_ADDRESS,
                data: 'powerchain1234',
                signature: 'powerchain5678',
                domain: {
                    verifyingContract: exchangeAddress,
                    chainId,
                },
            };
            const txOrigin = constants.NULL_ADDRESS;
            const approval = {
                txOrigin,
                transactionHash: transactionHashUtils.getTransactionHashHex(signedTx),
                transactionSignature: signedTx.signature,
            };
            const expectedApprovalHash = await hashUtils.getApprovalHashHexAsync(
                signedTx,
                coordinatorContract.address,
                txOrigin,
            );
            const approvalHash = await coordinatorContract.getCoordinatorApprovalHash(approval).callAsync();
            expect(expectedApprovalHash).to.eq(approvalHash);
        });
    });
});
