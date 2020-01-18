import {schemas} from '@powerchain/json-schemas';
import {Order} from '@powerchain/types';
import {BigNumber} from '@powerchain/utils';
import * as _ from 'lodash';

import {assert} from './assert';
import {constants} from './constants';
import {rateUtils} from './rate_utils';

export const sortingUtils = {
    /**
     * Takes an array of orders and sorts them by takerAsset/makerAsset rate in ascending order (best rate first).
     * Adjusts the rate of each order according to the feeRate and takerFee for that order.
     * @param   orders      An array of objects that extend the Order interface. All orders should specify NET as
     *                      the makerAsset and WETH as the takerAsset.
     * @param   feeRate     The market rate of NET denominated in takerAssetAmount
     *                      (ex. feeRate is 0.1 takerAsset/NET if it takes 1 unit of takerAsset to buy 10 NET)
     *                      Defaults to 0
     * @return  The input orders sorted by rate in ascending order
     */
    sortOrdersByFeeAdjustedRate<T extends Order>(orders: T[], feeRate: BigNumber = constants.ZERO_AMOUNT): T[] {
        assert.doesConformToSchema('orders', orders, schemas.ordersSchema);
        assert.isBigNumber('feeRate', feeRate);
        const rateCalculator = (order: Order) => rateUtils.getFeeAdjustedRateOfOrder(order, feeRate);
        const sortedOrders = sortOrders(orders, rateCalculator);
        return sortedOrders;
    },
    /**
     * Takes an array of fee orders (makerAssetData corresponds to NET and takerAssetData corresponds to WETH)
     * and sorts them by rate in ascending order (best rate first). Adjusts the rate according to the takerFee.
     * @param   feeOrders       An array of objects that extend the Order interface. All orders should specify NET as
     *                          the makerAsset and WETH as the takerAsset.
     * @return  The input orders sorted by rate in ascending order
     */
    sortFeeOrdersByFeeAdjustedRate<T extends Order>(feeOrders: T[]): T[] {
        assert.doesConformToSchema('feeOrders', feeOrders, schemas.ordersSchema);
        const rateCalculator = rateUtils.getFeeAdjustedRateOfFeeOrder.bind(rateUtils);
        const sortedOrders = sortOrders(feeOrders, rateCalculator);
        return sortedOrders;
    },
};

type RateCalculator = (order: Order) => BigNumber;

// takes an array of orders, copies them, and sorts the copy based on the rate definition provided by rateCalculator
function sortOrders<T extends Order>(orders: T[], rateCalculator: RateCalculator): T[] {
    const copiedOrders = _.cloneDeep(orders);
    copiedOrders.sort((firstOrder, secondOrder) => {
        const firstOrderRate = rateCalculator(firstOrder);
        const secondOrderRate = rateCalculator(secondOrder);
        return firstOrderRate.comparedTo(secondOrderRate);
    });
    return copiedOrders;
}
