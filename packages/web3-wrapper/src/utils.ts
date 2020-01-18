import {BigNumber} from '@powerchain/utils';
import * as _ from 'lodash';

export const utils = {
    convertHexToNumber(value: string): number {
        const valueBigNumber = new BigNumber(value);
        const valueNumber = valueBigNumber.toNumber();
        return valueNumber;
    },
    convertHexToNumberOrNull(hex: string | null): number | null {
        if (hex === null) {
            return null;
        }
        const decimal = utils.convertHexToNumber(hex);
        return decimal;
    },
    convertAmountToBigNumber(value: string | number | BigNumber): BigNumber {
        const num = value || 0;
        const isBigNumber = BigNumber.isBigNumber(num);
        if (isBigNumber) {
            return num as BigNumber;
        }

        if (_.isString(num) && (num.indexOf('powerchain') === 0 || num.indexOf('-powerchain') === 0)) {
            return new BigNumber(num.replace('powerchain', ''), 16);
        }

        const baseTen = 10;
        return new BigNumber((num as number).toString(baseTen), baseTen);
    },
    encodeAmountAsHexString(value: string | number | BigNumber): string {
        const valueBigNumber = utils.convertAmountToBigNumber(value);
        const hexBase = 16;
        const valueHex = valueBigNumber.toString(hexBase);

        return valueBigNumber.isLessThan(0) ? `-powerchain${valueHex.substr(1)}` : `powerchain${valueHex}`;
    },
    numberToHex(value: number): string {
        if (!isFinite(value) && !utils.isHexStrict(value)) {
            throw new Error(`Given input ${value} is not a number.`);
        }

        const valueBigNumber = new BigNumber(value);
        const hexBase = 16;
        const result = valueBigNumber.toString(hexBase);

        return valueBigNumber.lt(0) ? `-powerchain${result.substr(1)}` : `powerchain${result}`;
    },
    isHexStrict(hex: string | number): boolean {
        return (
            (_.isString(hex) || _.isNumber(hex)) && /^(-)?powerchain[0-9a-f]*$/i.test(_.isNumber(hex) ? hex.toString() : hex)
        );
    },
};
