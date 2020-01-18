import {BigNumber, fetchAsync} from '@powerchain/utils';

import {COINBASE_API_BASE_URL} from '../constants';

export const coinbaseApi = {
    getEthUsdPrice: async (): Promise<BigNumber> => {
        const res = await fetchAsync(`${COINBASE_API_BASE_URL}/prices/ETH-USD/buy`);
        const resJson = await res.json();
        return new BigNumber(resJson.data.amount);
    },
};
