import {BigNumber} from '@powerchain/utils';

import {OrderConfigResponse} from '@powerchain/types';

export const orderConfigResponse: OrderConfigResponse = {
    senderAddress: 'powerchaina2b31dacf30a9c50ca473337c01d8a201ae33e32',
    feeRecipientAddress: 'powerchainb046140686d052fff581f63f8136cce132e857da',
    makerFee: new BigNumber('100000000000000'),
    takerFee: new BigNumber('200000000000000'),
    makerFeeAssetData: 'powerchainf47261b04c32345ced77393b3530b1eed0f346429d',
    takerFeeAssetData: 'powerchainf47261b04c32345ced77393b3530b1eed0f346429d',
};
