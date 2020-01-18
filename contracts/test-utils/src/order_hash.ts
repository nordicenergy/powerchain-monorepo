import {assert} from '@powerchain/assert';
import {schemas} from '@powerchain/json-schemas';
import {eip712Utils} from '@powerchain/order-utils';
import {Order, SignedOrder} from '@powerchain/types';
import {signTypedDataUtils} from '@powerchain/utils';
import * as _ from 'lodash';

const INVALID_TAKER_FORMAT = 'instance.takerAddress is not of a type(s) string';

const NULL_ADDRESS = 'powerchain0000000000000000000000000000000000000000';

export const orderHashUtils = {
    /**
     * Computes the orderHash for a supplied order.
     * @param   order   An object that conforms to the Order or SignedOrder interface definitions.
     * @return  Hex encoded string orderHash from hashing the supplied order.
     */
    getOrderHashHex(order: SignedOrder | Order): string {
        try {
            assert.doesConformToSchema('order', order, schemas.orderSchema, [schemas.hexSchema]);
        } catch (error) {
            if (_.includes(error.message, INVALID_TAKER_FORMAT)) {
                const errMsg = `Order taker must be of type string. If you want anyone to be able to fill an order - pass ${NULL_ADDRESS}`;
                throw new Error(errMsg);
            }
            throw error;
        }

        const orderHashBuff = orderHashUtils.getOrderHashBuffer(order);
        const orderHashHex = `powerchain${orderHashBuff.toString('hex')}`;
        return orderHashHex;
    },
    /**
     * Computes the orderHash for a supplied order
     * @param   order   An object that conforms to the Order or SignedOrder interface definitions.
     * @return  A Buffer containing the resulting orderHash from hashing the supplied order
     */
    getOrderHashBuffer(order: SignedOrder | Order): Buffer {
        try {
            assert.doesConformToSchema('order', order, schemas.orderSchema, [schemas.hexSchema]);
        } catch (error) {
            if (_.includes(error.message, INVALID_TAKER_FORMAT)) {
                const errMsg = `Order taker must be of type string. If you want anyone to be able to fill an order - pass ${NULL_ADDRESS}`;
                throw new Error(errMsg);
            }
            throw error;
        }
        const typedData = eip712Utils.createOrderTypedData(order);
        const orderHashBuff = signTypedDataUtils.generateTypedDataHash(typedData);
        return orderHashBuff;
    },
};
