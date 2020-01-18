import {generatePseudoRandomSalt} from '@powerchain/order-utils';
import {Order, SignatureType, SignedOrder} from '@powerchain/types';
import {BigNumber} from '@powerchain/utils';

import {getLatestBlockTimestampAsync} from './block_timestamp';
import {constants} from './constants';
import {orderHashUtils} from './order_hash';
import {signingUtils} from './signing_utils';

export class OrderFactory {
    private readonly _defaultOrderParams: Partial<Order>;
    private readonly _privateKey: Buffer;

    constructor(privateKey: Buffer, defaultOrderParams: Partial<Order>) {
        this._defaultOrderParams = defaultOrderParams;
        this._privateKey = privateKey;
    }

    public async newSignedOrderAsync(
        customOrderParams: Partial<Order> = {},
        signatureType: SignatureType = SignatureType.EthSign,
    ): Promise<SignedOrder> {
        const fifteenMinutesInSeconds = 15 * 60;
        const currentBlockTimestamp = await getLatestBlockTimestampAsync();
        const order = ({
            takerAddress: constants.NULL_ADDRESS,
            senderAddress: constants.NULL_ADDRESS,
            expirationTimeSeconds: new BigNumber(currentBlockTimestamp).plus(fifteenMinutesInSeconds),
            salt: generatePseudoRandomSalt(),
            ...this._defaultOrderParams,
            ...customOrderParams,
        } as any) as Order;
        const orderHashBuff = orderHashUtils.getOrderHashBuffer(order);
        const signature = signingUtils.signMessage(orderHashBuff, this._privateKey, signatureType);
        const signedOrder = {
            ...order,
            signature: `powerchain${signature.toString('hex')}`,
        };
        return signedOrder;
    }
}
