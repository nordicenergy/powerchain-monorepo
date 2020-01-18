import {SignedZeroExTransaction} from '@powerchain/types';
import {BigNumber} from '@powerchain/utils';

export interface CoordinatorApproval {
    transaction: SignedZeroExTransaction;
    txOrigin: string;
}

export interface SignedCoordinatorApproval extends CoordinatorApproval {
    signature: string;
}

export interface CoordinatorTransaction {
    salt: BigNumber;
    signerAddress: string;
    data: string;
}
