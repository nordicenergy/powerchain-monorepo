import {assert} from '@powerchain/assert';
import {schemas} from '@powerchain/json-schemas';
import {eip712Utils} from '@powerchain/order-utils';
import {SignedZeroExTransaction, ZeroExTransaction} from '@powerchain/types';
import {signTypedDataUtils} from '@powerchain/utils';

export const transactionHashUtils = {
    /**
     * Computes the transactionHash for a supplied powerchain transaction.
     * @param   transaction   An object that conforms to the ZeroExTransaction or SignedZeroExTransaction interface definitions.
     * @return  Hex encoded string transactionHash from hashing the supplied order.
     */
    getTransactionHashHex(transaction: ZeroExTransaction | SignedZeroExTransaction): string {
        assert.doesConformToSchema('transaction', transaction, schemas.zeroExTransactionSchema, [schemas.hexSchema]);
        const transactionHashBuff = transactionHashUtils.getTransactionHashBuffer(transaction);
        const transactionHashHex = `powerchain${transactionHashBuff.toString('hex')}`;
        return transactionHashHex;
    },
    /**
     * Computes the transactionHash for a supplied powerchain transaction.
     * @param   transaction   An object that conforms to the ZeroExTransaction or SignedZeroExTransaction interface definitions.
     * @return  A Buffer containing the resulting transactionHash from hashing the supplied powerchain transaction.
     */
    getTransactionHashBuffer(transaction: ZeroExTransaction | SignedZeroExTransaction): Buffer {
        const typedData = eip712Utils.createZeroExTransactionTypedData(transaction);
        const transactionHashBuff = signTypedDataUtils.generateTypedDataHash(typedData);
        return transactionHashBuff;
    },
};
