import {expect} from '@powerchain/contracts-test-utils';
import {RevertError} from '@powerchain/utils';

import {PoolOperatorActor} from './pool_operator_actor';

export class MakerActor extends PoolOperatorActor {
    public async joinStakingPoolAsMakerAsync(poolId: string, revertError?: RevertError): Promise<void> {
        // add maker
        const txReceiptPromise = this._stakingApiWrapper.stakingContract
            .joinStakingPoolAsMaker(poolId)
            .awaitTransactionSuccessAsync({ from: this.getOwner() });
        if (revertError !== undefined) {
            await expect(txReceiptPromise).to.revertWith(revertError);
            return;
        }
        await txReceiptPromise;
        // check the pool id of the maker
        const poolIdOfMaker = await this._stakingApiWrapper.stakingContract.poolIdByMaker(this.getOwner()).callAsync();
        expect(poolIdOfMaker, 'pool id of maker').to.be.equal(poolId);
    }
}
