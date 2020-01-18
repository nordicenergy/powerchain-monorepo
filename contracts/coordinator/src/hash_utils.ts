import {eip712Utils} from '@powerchain/order-utils';
import {SignedZeroExTransaction} from '@powerchain/types';
import {hexUtils, signTypedDataUtils} from '@powerchain/utils';

export const hashUtils = {
    async getApprovalHashBufferAsync(
        transaction: SignedZeroExTransaction,
        verifyingContract: string,
        txOrigin: string,
    ): Promise<Buffer> {
        const typedData = await eip712Utils.createCoordinatorApprovalTypedDataAsync(
            transaction,
            verifyingContract,
            txOrigin,
        );
        const hashBuffer = signTypedDataUtils.generateTypedDataHash(typedData);
        return hashBuffer;
    },
    async getApprovalHashHexAsync(
        transaction: SignedZeroExTransaction,
        verifyingContract: string,
        txOrigin: string,
    ): Promise<string> {
        const hashHex = hexUtils.concat(
            await hashUtils.getApprovalHashBufferAsync(transaction, verifyingContract, txOrigin),
        );
        return hashHex;
    },
};
