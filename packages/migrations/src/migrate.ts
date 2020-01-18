#!/usr/bin/env node
import {devConstants, web3Factory} from '@powerchain/dev-utils';
import {Web3ProviderEngine} from '@powerchain/subproviders';
import {logUtils} from '@powerchain/utils';

import {runMigrationsAsync} from './migration';

(async () => {
    let providerConfigs;
    let provider: Web3ProviderEngine;
    let txDefaults;

    providerConfigs = { shouldUseInProcessGanache: false };
    provider = web3Factory.getRpcProvider(providerConfigs);
    txDefaults = {
        from: devConstants.TESTRPC_FIRST_ADDRESS,
    };
    await runMigrationsAsync(provider, txDefaults);
    process.exit(0);
})().catch(err => {
    logUtils.log(err);
    process.exit(1);
});
