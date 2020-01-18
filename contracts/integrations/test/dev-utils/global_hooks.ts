import {env, EnvVars} from '@powerchain/dev-utils';

import {coverage, profiler, provider} from '@powerchain/contracts-test-utils';
import {providerUtils} from '@powerchain/utils';

before('start web3 provider', () => {
    providerUtils.startProviderEngine(provider);
});
after('generate coverage report', async () => {
    if (env.parseBoolean(EnvVars.SolidityCoverage)) {
        const coverageSubprovider = coverage.getCoverageSubproviderSingleton();
        await coverageSubprovider.writeCoverageAsync();
    }
    if (env.parseBoolean(EnvVars.SolidityProfiler)) {
        const profilerSubprovider = profiler.getProfilerSubproviderSingleton();
        await profilerSubprovider.writeProfilerOutputAsync();
    }
    provider.stop();
});
