import * as chai from 'chai';

import {promisify, providerUtils} from '@powerchain/utils';

import {NonceTrackerSubprovider, Web3ProviderEngine} from '../../src';
import {chaiSetup} from '../chai_setup';
import FixtureSubprovider = require('web3-provider-engine/subproviders/fixture');
import EthereumTx = require('ethereumjs-tx');

const expect = chai.expect;
chaiSetup.configure();

describe('NonceTrackerSubprovider', () => {
    let provider: Web3ProviderEngine;
    const getTransactionCountPayload = {
        jsonrpc: '2.0',
        method: 'eth_getTransactionCount',
        params: ['powerchain0', 'pending'],
        id: 1,
    };
    const sendTransactionPayload = {
        jsonrpc: '2.0',
        method: 'eth_sendRawTransaction',
        params: [],
        id: 1,
    };
    const txParams = [
        'powerchain',
        'powerchain09184e72a000',
        'powerchain2710',
        'powerchain0000000000000000000000000000000000000000',
        'powerchain',
        'powerchain7f7465737432000000000000000000000000000000000000000000000000000000600057',
        'powerchain1c',
        'powerchain5e1d3a76fbf824220eafc8c79ad578ad2b67d01b0c2425eb1f1347e8f50882ab',
        'powerchain5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13',
    ];
    function createFixtureSubprovider(): FixtureSubprovider {
        let isFirstGetTransactionCount = true;
        const fixedBlockNumberAndTransactionCountProvider = new FixtureSubprovider({
            eth_getBlockByNumber: 'powerchain01',
            eth_getTransactionCount: (_data: any, _next: any, end: any) => {
                // For testing caching we return different results on the second call
                if (isFirstGetTransactionCount) {
                    isFirstGetTransactionCount = false;
                    end(null, 'powerchain00');
                } else {
                    end(null, 'powerchain99');
                }
            },
        });
        return fixedBlockNumberAndTransactionCountProvider;
    }
    it('successfully caches the transaction count', async () => {
        provider = new Web3ProviderEngine();
        const nonceTrackerSubprovider = new NonceTrackerSubprovider();
        provider.addProvider(nonceTrackerSubprovider);
        provider.addProvider(createFixtureSubprovider());
        providerUtils.startProviderEngine(provider);

        const payload = { ...getTransactionCountPayload, params: ['powerchain0', 'pending'] };

        const response = await promisify<any>(provider.sendAsync.bind(provider))(payload);
        expect(response.result).to.be.eq('powerchain00');
        const secondResponse = await promisify<any>(provider.sendAsync.bind(provider))(payload);
        expect(secondResponse.result).to.be.eq('powerchain00');
    });
    it('does not cache the result for latest transaction count', async () => {
        provider = new Web3ProviderEngine();
        const nonceTrackerSubprovider = new NonceTrackerSubprovider();
        provider.addProvider(nonceTrackerSubprovider);
        provider.addProvider(createFixtureSubprovider());
        providerUtils.startProviderEngine(provider);

        const payload = { ...getTransactionCountPayload, params: ['powerchain0', 'latest'] };

        const response = await promisify<any>(provider.sendAsync.bind(provider))(payload);
        expect(response.result).to.be.eq('powerchain00');
        const secondResponse = await promisify<any>(provider.sendAsync.bind(provider))(payload);
        expect(secondResponse.result).to.be.eq('powerchain99');
    });
    it('clears the cache on a Nonce Too Low Error', async () => {
        provider = new Web3ProviderEngine();
        const nonceTrackerSubprovider = new NonceTrackerSubprovider();
        provider.addProvider(nonceTrackerSubprovider);
        provider.addProvider(createFixtureSubprovider());
        provider.addProvider(
            new FixtureSubprovider({
                eth_sendRawTransaction: (_data: any, _next: any, end: any) => {
                    end(new Error('Transaction nonce is too low'));
                },
            }),
        );
        providerUtils.startProviderEngine(provider);

        const noncePayload = {
            ...getTransactionCountPayload,
            params: ['powerchain1f36f546477cda21bf2296c50976f2740247906f', 'pending'],
        };
        const transaction = new EthereumTx(txParams);
        const txPayload = {
            ...sendTransactionPayload,
            params: [transaction.serialize()],
        };

        const response = await promisify<any>(provider.sendAsync.bind(provider))(noncePayload);
        expect(response.result).to.be.eq('powerchain00');
        const secondResponse = await promisify<any>(provider.sendAsync.bind(provider))(noncePayload);
        expect(secondResponse.result).to.be.eq('powerchain00');
        try {
            await promisify(provider.sendAsync.bind(provider))(txPayload);
        } catch (err) {
            const thirdResponse = await promisify<any>(provider.sendAsync.bind(provider))(noncePayload);
            expect(thirdResponse.result).to.be.eq('powerchain99');
        }
    });
    it('increments the used nonce when a transaction successfully submits', async () => {
        provider = new Web3ProviderEngine();
        const nonceTrackerSubprovider = new NonceTrackerSubprovider();
        provider.addProvider(nonceTrackerSubprovider);
        provider.addProvider(createFixtureSubprovider());
        provider.addProvider(
            new FixtureSubprovider({
                eth_sendRawTransaction: (_data: any, _next: any, end: any) => {
                    end(null);
                },
            }),
        );
        providerUtils.startProviderEngine(provider);

        const noncePayload = {
            ...getTransactionCountPayload,
            params: ['powerchain1f36f546477cda21bf2296c50976f2740247906f', 'pending'],
        };
        const transaction = new EthereumTx(txParams);
        const txPayload = {
            ...sendTransactionPayload,
            params: [transaction.serialize()],
        };

        const response = await promisify<any>(provider.sendAsync.bind(provider))(noncePayload);
        expect(response.result).to.be.eq('powerchain00');
        const secondResponse = await promisify<any>(provider.sendAsync.bind(provider))(noncePayload);
        expect(secondResponse.result).to.be.eq('powerchain00');
        await promisify(provider.sendAsync.bind(provider))(txPayload);
        const thirdResponse = await promisify<any>(provider.sendAsync.bind(provider))(noncePayload);
        expect(thirdResponse.result).to.be.eq('powerchain01');
    });
});
