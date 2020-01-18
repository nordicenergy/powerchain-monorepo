import {chaiSetup, constants, getCodesizeFromArtifact} from '@powerchain/contracts-test-utils';
import * as chai from 'chai';
import {artifacts} from './artifacts';

chaiSetup.configure();
const expect = chai.expect;

describe('Contract Size Checks', () => {
    describe('Exchange', () => {
        it('should have a codesize less than the maximum', async () => {
            const actualSize = getCodesizeFromArtifact(artifacts.Exchange);
            expect(actualSize).to.be.lt(constants.MAX_CODE_SIZE);
        });
    });
});
