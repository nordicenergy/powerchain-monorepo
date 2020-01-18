import {chaiSetup} from '@powerchain/dev-utils';
import * as chai from 'chai';

export { chaiSetup } from '@powerchain/dev-utils';

// Set up chai.
chaiSetup.configure();
export const expect = chai.expect;
