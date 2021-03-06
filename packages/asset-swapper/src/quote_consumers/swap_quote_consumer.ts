import {ContractAddresses, getContractAddressesForChainOrThrow} from '@powerchain/contract-addresses';
import {providerUtils} from '@powerchain/utils';
import {SupportedProvider, ZeroExProvider} from '@powerchain/web3-wrapper';
import * as _ from 'lodash';

import {constants} from '../constants';
import {
    CalldataInfo,
    ExtensionContractType,
    GetExtensionContractTypeOpts,
    SwapQuote,
    SwapQuoteConsumerBase,
    SwapQuoteConsumerOpts,
    SwapQuoteExecutionOpts,
    SwapQuoteGetOutputOpts,
} from '../types';
import {assert} from '../utils/assert';
import {swapQuoteConsumerUtils} from '../utils/swap_quote_consumer_utils';

import {ExchangeSwapQuoteConsumer} from './exchange_swap_quote_consumer';
import {ForwarderSwapQuoteConsumer} from './forwarder_swap_quote_consumer';

export class SwapQuoteConsumer implements SwapQuoteConsumerBase {
    public readonly provider: ZeroExProvider;
    public readonly chainId: number;

    private readonly _exchangeConsumer: ExchangeSwapQuoteConsumer;
    private readonly _forwarderConsumer: ForwarderSwapQuoteConsumer;
    private readonly _contractAddresses: ContractAddresses;

    public static getSwapQuoteConsumer(
        supportedProvider: SupportedProvider,
        options: Partial<SwapQuoteConsumerOpts> = {},
    ): SwapQuoteConsumer {
        return new SwapQuoteConsumer(supportedProvider, options);
    }

    constructor(supportedProvider: SupportedProvider, options: Partial<SwapQuoteConsumerOpts> = {}) {
        const { chainId } = _.merge({}, constants.DEFAULT_SWAP_QUOTER_OPTS, options);
        assert.isNumber('chainId', chainId);

        const provider = providerUtils.standardizeOrThrow(supportedProvider);
        this.provider = provider;
        this.chainId = chainId;
        this._contractAddresses = getContractAddressesForChainOrThrow(chainId);
        this._exchangeConsumer = new ExchangeSwapQuoteConsumer(supportedProvider, this._contractAddresses, options);
        this._forwarderConsumer = new ForwarderSwapQuoteConsumer(supportedProvider, this._contractAddresses, options);
    }

    /**
     * Given a SwapQuote, returns 'CalldataInfo' for a powerchain extesion or exchange call. See type definition of CalldataInfo for more information.
     * @param quote An object that conforms to SwapQuote. See type definition for more information.
     * @param opts  Options for getting SmartContractParams. See type definition for more information.
     */
    public async getCalldataOrThrowAsync(
        quote: SwapQuote,
        opts: Partial<SwapQuoteGetOutputOpts> = {},
    ): Promise<CalldataInfo> {
        assert.isValidSwapQuote('quote', quote);
        const consumer = await this._getConsumerForSwapQuoteAsync(opts);
        return consumer.getCalldataOrThrowAsync(quote, opts);
    }

    /**
     * Given a SwapQuote and desired rate (in takerAsset), attempt to execute the swap with powerchain extension or exchange contract.
     * @param quote An object that conforms to SwapQuote. See type definition for more information.
     * @param opts  Options for getting CalldataInfo. See type definition for more information.
     */
    public async executeSwapQuoteOrThrowAsync(
        quote: SwapQuote,
        opts: Partial<SwapQuoteExecutionOpts> = {},
    ): Promise<string> {
        assert.isValidSwapQuote('quote', quote);
        const consumer = await this._getConsumerForSwapQuoteAsync(opts);
        return consumer.executeSwapQuoteOrThrowAsync(quote, opts);
    }

    /**
     * Given a SwapQuote, returns optimal powerchain protocol interface (extension or no extension) to perform the swap.
     * @param quote An object that conforms to SwapQuote. See type definition for more information.
     * @param opts  Options for getting optimal exteion contract to fill quote. See type definition for more information.
     */
    public async getOptimalExtensionContractTypeAsync(
        quote: SwapQuote,
        opts: Partial<GetExtensionContractTypeOpts> = {},
    ): Promise<ExtensionContractType> {
        return swapQuoteConsumerUtils.getExtensionContractTypeForSwapQuoteAsync(
            quote,
            this._contractAddresses,
            this.provider,
            opts,
        );
    }

    private async _getConsumerForSwapQuoteAsync(opts: Partial<SwapQuoteGetOutputOpts>): Promise<SwapQuoteConsumerBase> {
        if (opts.useExtensionContract === ExtensionContractType.Forwarder) {
            return this._forwarderConsumer;
        }
        return this._exchangeConsumer;
    }
}
