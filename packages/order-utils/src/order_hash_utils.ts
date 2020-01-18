import {DevUtilsContract} from '@powerchain/contract-wrappers';
import {Order} from '@powerchain/types';
import {BigNumber} from '@powerchain/utils';

import {constants} from './constants';

const devUtilsContract = new DevUtilsContract(constants.NULL_ADDRESS, constants.FAKED_PROVIDER as any);

export const orderHashUtils = {
    getOrderHashAsync: async (order: Order): Promise<string> => {
        const orderHash = await devUtilsContract
            .getOrderHash(order, new BigNumber(order.chainId), order.exchangeAddress)
            .callAsync();
        return orderHash;
    },
};
