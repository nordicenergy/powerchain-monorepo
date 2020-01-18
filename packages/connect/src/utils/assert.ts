import {assert as sharedAssert} from '@powerchain/assert';
// HACK: We need those two unused imports because they're actually used by sharedAssert which gets injected here
// tslint:disable-next-line:no-unused-variable
import {schemas} from '@powerchain/json-schemas';
// tslint:disable-next-line:no-unused-variable
// tslint:disable-next-line:no-unused-variable
import * as _ from 'lodash';

export const assert = {
    ...sharedAssert,
    isOrdersChannelSubscriptionOpts(variableName: string, subscriptionOpts: any): void {
        sharedAssert.doesConformToSchema(
            variableName,
            subscriptionOpts,
            schemas.relayerApiOrdersChannelSubscribePayloadSchema,
        );
    },
    isOrdersChannelHandler(variableName: string, handler: any): void {
        sharedAssert.isFunction(`${variableName}.onUpdate`, _.get(handler, 'onUpdate'));
        sharedAssert.isFunction(`${variableName}.onError`, _.get(handler, 'onError'));
        sharedAssert.isFunction(`${variableName}.onClose`, _.get(handler, 'onClose'));
    },
};
