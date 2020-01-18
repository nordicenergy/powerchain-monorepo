import {RevertError} from '@powerchain/utils';
import * as chai from 'chai';
import * as dirtyChai from 'dirty-chai';

import {revertErrorHelper} from './chai_revert_error';
import chaiAsPromised = require('chai-as-promised');
import ChaiBigNumber = require('chai-bignumber');

declare global {
    namespace Chai {
        export interface Assertion {
            revertWith: (expected: string | RevertError) => Promise<void>;
        }
    }
}

export const chaiSetup = {
    configure(): void {
        chai.config.includeStack = true;
        // Order matters.
        chai.use(ChaiBigNumber());
        chai.use(chaiAsPromised);
        chai.use(revertErrorHelper);
        chai.use(dirtyChai);
    },
};
