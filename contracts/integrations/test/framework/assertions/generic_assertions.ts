import {BaseContract} from '@powerchain/base-contract';
import {expect} from '@powerchain/contracts-test-utils';
import {RevertReason} from '@powerchain/types';
import {StringRevertError} from '@powerchain/utils';

import {FunctionAssertion, FunctionResult} from './function_assertion';

/**
 * Returns a generic FunctionAssertion for the given contract function, asserting that the
 * function call reverts in an asset proxy contract with TRANSFER_FAILED.
 */
export function assetProxyTransferFailedAssertion<TArgs extends any[]>(
    contract: BaseContract,
    functionName: string,
): FunctionAssertion<TArgs, void, void> {
    return new FunctionAssertion(contract, functionName, {
        after: async (_beforeInfo: void, result: FunctionResult) => {
            // Ensure that the tx reverted.
            expect(result.success).to.be.false();
            // Check revert error
            expect(result.data).to.equal(new StringRevertError(RevertReason.TransferFailed));
        },
    });
}
