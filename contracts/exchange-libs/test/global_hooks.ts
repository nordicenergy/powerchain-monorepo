import {coverage, profiler, provider} from '@powerchain/contracts-test-utils';
import {env, EnvVars} from '@powerchain/dev-utils';
import {prependSubprovider} from '@powerchain/subproviders';
import {providerUtils} from '@powerchain/utils';

const coverageSubprovider = coverage.getCoverageSubproviderSingleton();
const profilerSubprovider = profiler.getProfilerSubproviderSingleton();

if (env.parseBoolean(EnvVars.SolidityCoverage)) {
    prependSubprovider(provider, coverageSubprovider);
    provider.stop();
}
if (env.parseBoolean(EnvVars.SolidityProfiler)) {
    prependSubprovider(provider, profilerSubprovider);
    provider.stop();
}

before('start web3 provider', () => {
    providerUtils.startProviderEngine(provider);
});
after('generate coverage report', async () => {
    if (env.parseBoolean(EnvVars.SolidityCoverage)) {
        await coverageSubprovider.writeCoverageAsync();
    }
    if (env.parseBoolean(EnvVars.SolidityProfiler)) {
        await profilerSubprovider.writeProfilerOutputAsync();
    }
    provider.stop();
});
