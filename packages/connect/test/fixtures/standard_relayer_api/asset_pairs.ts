import {BigNumber} from '@powerchain/utils';

import {AssetPairsResponse} from '@powerchain/types';

export const assetDataPairsResponse: AssetPairsResponse = {
    total: 43,
    page: 1,
    perPage: 100,
    records: [
        {
            assetDataA: {
                minAmount: new BigNumber('0'),
                maxAmount: new BigNumber('10000000000000000000'),
                precision: 5,
                assetData: 'powerchainf47261b04c32345ced77393b3530b1eed0f346429d',
            },
            assetDataB: {
                minAmount: new BigNumber('0'),
                maxAmount: new BigNumber('50000000000000000000'),
                precision: 5,
                assetData: 'powerchain0257179264389b814a946f3e92105513705ca6b990',
            },
        },
    ],
};
