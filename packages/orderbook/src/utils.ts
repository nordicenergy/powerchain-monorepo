import {APIOrder, SignedOrder} from '@powerchain/connect';
import {orderHashUtils} from '@powerchain/order-utils';

export const utils = {
    async getOrderHashAsync(order: APIOrder | SignedOrder): Promise<string> {
        if ((order as APIOrder).metaData) {
            const apiOrder = order as APIOrder;
            const orderHash =
                (apiOrder.metaData as any).orderHash || (await orderHashUtils.getOrderHashAsync(apiOrder.order));
            return orderHash;
        } else {
            const signedOrder = order as SignedOrder;
            const orderHash = await orderHashUtils.getOrderHashAsync(signedOrder);
            return orderHash;
        }
    },
    async delayAsync(ms: number): Promise<void> {
        // tslint:disable:no-inferred-empty-object-type
        return new Promise<void>(resolve => setTimeout(resolve, ms));
    },
    async attemptAsync<T>(
        fn: () => Promise<T>,
        opts: { interval: number; maxRetries: number } = { interval: 1000, maxRetries: 10 },
    ): Promise<T> {
        let result: T | undefined;
        let attempt = 0;
        let error;
        let isSuccess = false;
        while (!result && attempt < opts.maxRetries) {
            attempt++;
            try {
                result = await fn();
                isSuccess = true;
                error = undefined;
            } catch (err) {
                error = err;
                await utils.delayAsync(opts.interval);
            }
        }
        if (!isSuccess) {
            throw error;
        }
        return result as T;
    },
};
