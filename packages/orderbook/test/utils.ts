import {APIOrder} from '@powerchain/connect';
import {BigNumber} from '@powerchain/utils';

export const createOrder = (makerAssetData: string, takerAssetData: string): APIOrder => {
    return {
        order: {
            makerAddress: 'powerchain00',
            takerAddress: 'powerchain00',
            makerAssetData,
            takerAssetData,
            makerFeeAssetData: makerAssetData,
            takerFeeAssetData: takerAssetData,
            chainId: 0,
            exchangeAddress: 'powerchain00',
            senderAddress: 'powerchain00',
            makerAssetAmount: new BigNumber(1),
            takerAssetAmount: new BigNumber(1),
            feeRecipientAddress: 'powerchain00',
            makerFee: new BigNumber(0),
            takerFee: new BigNumber(0),
            salt: new BigNumber(0),
            expirationTimeSeconds: new BigNumber(0),
            signature: 'powerchainsig',
        },
        metaData: {
            orderHash: 'powerchain12345',
            remainingFillableTakerAssetAmount: new BigNumber(1),
        },
    };
};
