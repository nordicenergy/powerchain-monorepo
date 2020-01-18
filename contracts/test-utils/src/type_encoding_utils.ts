import {BigNumber} from '@powerchain/utils';

import {constants} from './constants';
import BN = require('bn.js');
import ethUtil = require('ethereumjs-util');

export const typeEncodingUtils = {
    encodeUint256(value: BigNumber): Buffer {
        const base = 10;
        const formattedValue = new BN(value.toString(base));
        const encodedValue = ethUtil.toBuffer(formattedValue);
        // tslint:disable-next-line:custom-no-magic-numbers
        const paddedValue = ethUtil.setLengthLeft(encodedValue, constants.WORD_LENGTH);
        return paddedValue;
    },
    decodeUint256(encodedValue: Buffer): BigNumber {
        const formattedValue = ethUtil.bufferToHex(encodedValue);
        const value = new BigNumber(formattedValue, constants.BASE_16);
        return value;
    },
};
