import {SignedOrder} from '@powerchain/types';
import {BigNumber} from '@powerchain/utils';

export interface AbiDecodedFillOrderData {
    order: SignedOrder;
    takerAssetFillAmount: BigNumber;
    signature: string;
}

export enum ExchangeFunctionName {
    BatchCancelOrders = 'batchCancelOrders',
    BatchExecuteTransactions = 'batchExecuteTransactions',
    BatchFillOrKillOrders = 'batchFillOrKillOrders',
    BatchFillOrders = 'batchFillOrders',
    BatchFillOrdersNoThrow = 'batchFillOrdersNoThrow',
    BatchMatchOrders = 'batchMatchOrders',
    BatchMatchOrdersWithMaximalFill = 'batchMatchOrdersWithMaximalFill',
    CancelOrder = 'cancelOrder',
    CancelOrdersUpTo = 'cancelOrdersUpTo',
    ExecuteTransaction = 'executeTransaction',
    FillOrKillOrder = 'fillOrKillOrder',
    FillOrder = 'fillOrder',
    FillOrderNoThrow = 'fillOrderNoThrow',
    MarketBuyOrdersNoThrow = 'marketBuyOrdersNoThrow',
    MarketSellOrdersNoThrow = 'marketSellOrdersNoThrow',
    MarketBuyOrdersFillOrKill = 'marketBuyOrdersFillOrKill',
    MarketSellOrdersFillOrKill = 'marketSellOrdersFillOrKill',
    MatchOrders = 'matchOrders',
    MatchOrdersWithMaximalFill = 'matchOrdersWithMaximalFill',
    PreSign = 'preSign',
    RegisterAssetProxy = 'registerAssetProxy',
    SetSignatureValidatorApproval = 'setSignatureValidatorApproval',
    SimulateDispatchTransferFromCalls = 'simulateDispatchTransferFromCalls',
    TransferOwnership = 'transferOwnership',
    SetProtocolFeeMultiplier = 'setProtocolFeeMultiplier',
    SetProtocolFeeCollectorAddress = 'setProtocolFeeCollectorAddress',
    DetachProtocolFeeCollector = 'detachProtocolFeeCollector',
}

export enum TradeSide {
    Maker = 'maker',
    Taker = 'taker',
}

export enum TransferType {
    Trade = 'trade',
    Fee = 'fee',
}
