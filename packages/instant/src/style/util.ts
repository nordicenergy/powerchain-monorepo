import {ObjectMap} from '@powerchain/types';
import * as _ from 'lodash';

export const cssRuleIfExists = (props: ObjectMap<any>, rule: string): string => {
    const camelCaseRule = _.camelCase(rule);
    const ruleValueIfExists = props[camelCaseRule];
    if (ruleValueIfExists !== undefined) {
        return `${rule}: ${ruleValueIfExists};`;
    }
    return '';
};
