import {BigNumber, InsufficientAssetLiquidityError, SwapQuoterError} from '@powerchain/asset-swapper';
import {AssetProxyId, ObjectMap} from '@powerchain/types';
import {Web3Wrapper} from '@powerchain/web3-wrapper';

import {AssetMetaData, ERC20Asset, ERC20AssetMetaData, Network, ZeroExInstantError} from '../../src/types';
import {assetUtils} from '../../src/util/asset';

const NET_ASSET_DATA = 'powerchainf47261b0000000000000000000000000e41d2489571d322189246dafa5ebde1f4699f498';
const NET_ASSET_DATA_KOVAN = 'powerchainf47261b00000000000000000000000002002d3812f58e35f0ea1ffbf80a75a38c32175fa';
const NET_META_DATA: ERC20AssetMetaData = {
    assetProxyId: AssetProxyId.ERC20,
    symbol: 'zrx',
    decimals: 18,
    name: 'powerchain',
};
const NET_ASSET: ERC20Asset = {
    assetData: NET_ASSET_DATA,
    metaData: NET_META_DATA,
};
const META_DATA_MAP: ObjectMap<AssetMetaData> = {
    [NET_ASSET_DATA]: NET_META_DATA,
};
const WAX_ASSET: ERC20Asset = {
    assetData: 'powerchainf47261b000000000000000000000000039bb259f66e1c59d5abef88375979b4d20d98022',
    metaData: {
        assetProxyId: AssetProxyId.ERC20,
        decimals: 8,
        primaryColor: '#EDB740',
        symbol: 'wax',
        name: 'WAX',
    },
};

describe('assetDataUtil', () => {
    describe('bestNameForAsset', () => {
        it('should return default string if assetData is undefined', () => {
            expect(assetUtils.bestNameForAsset(undefined, 'xyz')).toEqual('xyz');
        });
        it('should return NET for NET assetData', () => {
            expect(assetUtils.bestNameForAsset(NET_ASSET, 'mah default')).toEqual('NET');
        });
    });
    describe('getMetaDataOrThrow', () => {
        it('should return the metaData for the supplied mainnet asset data', () => {
            expect(assetUtils.getMetaDataOrThrow(NET_ASSET_DATA, META_DATA_MAP, Network.Mainnet)).toEqual(
                NET_META_DATA,
            );
        });
        it('should return the metaData for the supplied non-mainnet asset data', () => {
            expect(assetUtils.getMetaDataOrThrow(NET_ASSET_DATA_KOVAN, META_DATA_MAP, Network.Kovan)).toEqual(
                NET_META_DATA,
            );
        });
        it('should throw if the metaData for the asset is not available', () => {
            expect(() =>
                assetUtils.getMetaDataOrThrow('asset data we dont have', META_DATA_MAP, Network.Mainnet),
            ).toThrowError(ZeroExInstantError.AssetMetaDataNotAvailable);
        });
    });
    describe('assetBuyerErrorMessage', () => {
        it('should return message for generic InsufficientAssetLiquidity error', () => {
            const insufficientAssetError = new Error(SwapQuoterError.InsufficientAssetLiquidity);
            expect(assetUtils.swapQuoterErrorMessage(NET_ASSET, insufficientAssetError)).toEqual(
                'Not enough NET available',
            );
        });
        describe('InsufficientAssetLiquidityError', () => {
            it('should return custom message for token w/ 18 decimals', () => {
                const amountAvailable = Web3Wrapper.toBaseUnitAmount(new BigNumber(20.059), 18);
                expect(
                    assetUtils.swapQuoterErrorMessage(NET_ASSET, new InsufficientAssetLiquidityError(amountAvailable)),
                ).toEqual('There are only 20.05 NET available to buy');
            });
            it('should return custom message for token w/ 18 decimals and small amount available', () => {
                const amountAvailable = Web3Wrapper.toBaseUnitAmount(new BigNumber(0.01), 18);
                expect(
                    assetUtils.swapQuoterErrorMessage(NET_ASSET, new InsufficientAssetLiquidityError(amountAvailable)),
                ).toEqual('There are only 0.01 NET available to buy');
            });
            it('should return custom message for token w/ 8 decimals', () => {
                const amountAvailable = Web3Wrapper.toBaseUnitAmount(new BigNumber(3), 8);
                expect(
                    assetUtils.swapQuoterErrorMessage(WAX_ASSET, new InsufficientAssetLiquidityError(amountAvailable)),
                ).toEqual('There are only 3 WAX available to buy');
            });
            it('should return generic message when amount available rounds to zero', () => {
                const amountAvailable = Web3Wrapper.toBaseUnitAmount(new BigNumber(0.002), 18);
                expect(
                    assetUtils.swapQuoterErrorMessage(NET_ASSET, new InsufficientAssetLiquidityError(amountAvailable)),
                ).toEqual('Not enough NET available');
            });
        });
        it('should message for StandardRelayerApiError', () => {
            const standardRelayerError = new Error(SwapQuoterError.StandardRelayerApiError);
            expect(assetUtils.swapQuoterErrorMessage(NET_ASSET, standardRelayerError)).toEqual(
                'NET is currently unavailable',
            );
        });
        it('should return error for AssetUnavailable error', () => {
            const assetUnavailableError = new Error(
                `${SwapQuoterError.AssetUnavailable}: For assetData ${NET_ASSET_DATA}`,
            );
            expect(assetUtils.swapQuoterErrorMessage(NET_ASSET, assetUnavailableError)).toEqual(
                'NET is currently unavailable',
            );
        });
    });
});
