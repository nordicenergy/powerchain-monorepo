import {signingUtils} from '@powerchain/contracts-test-utils';
import {SignatureType, SignedZeroExTransaction} from '@powerchain/types';
import {hexUtils} from '@powerchain/utils';

import {hashUtils} from './hash_utils';
import {SignedCoordinatorApproval} from './types';

export class ApprovalFactory {
    private readonly _privateKey: Buffer;
    private readonly _verifyingContractAddress: string;

    constructor(privateKey: Buffer, verifyingContract: string) {
        this._privateKey = privateKey;
        this._verifyingContractAddress = verifyingContract;
    }

    public async newSignedApprovalAsync(
        transaction: SignedZeroExTransaction,
        txOrigin: string,
        signatureType: SignatureType = SignatureType.EthSign,
    ): Promise<SignedCoordinatorApproval> {
        const approvalHashBuff = await hashUtils.getApprovalHashBufferAsync(
            transaction,
            this._verifyingContractAddress,
            txOrigin,
        );
        const signatureBuff = signingUtils.signMessage(approvalHashBuff, this._privateKey, signatureType);
        const signedApproval = {
            txOrigin,
            transaction,
            signature: hexUtils.concat(signatureBuff),
        };
        return signedApproval;
    }
}
