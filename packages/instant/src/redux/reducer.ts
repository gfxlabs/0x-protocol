import { AssetBuyer, BuyQuote } from '@0x/asset-buyer';
import { ObjectMap } from '@0x/types';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';

import { assetMetaDataMap } from '../data/asset_meta_data_map';
import { Asset, AssetMetaData, AsyncProcessState, Network } from '../types';
import { assetUtils } from '../util/asset';

import { Action, ActionTypes } from './actions';

export enum LatestErrorDisplay {
    Present,
    Hidden,
}
export interface State {
    network: Network;
    assetBuyer?: AssetBuyer;
    assetMetaDataMap: ObjectMap<AssetMetaData>;
    selectedAsset?: Asset;
    selectedAssetAmount?: BigNumber;
    buyOrderState: AsyncProcessState;
    ethUsdPrice?: BigNumber;
    latestBuyQuote?: BuyQuote;
    quoteState: AsyncProcessState;
    latestError?: any;
    latestErrorDisplay: LatestErrorDisplay;
}

export const INITIAL_STATE: State = {
    network: Network.Mainnet,
    selectedAssetAmount: undefined,
    assetMetaDataMap,
    buyOrderState: AsyncProcessState.NONE,
    ethUsdPrice: undefined,
    latestBuyQuote: undefined,
    latestError: undefined,
    latestErrorDisplay: LatestErrorDisplay.Hidden,
    quoteState: AsyncProcessState.NONE,
};

export const reducer = (state: State = INITIAL_STATE, action: Action): State => {
    switch (action.type) {
        case ActionTypes.UPDATE_ETH_USD_PRICE:
            return {
                ...state,
                ethUsdPrice: action.data,
            };
        case ActionTypes.UPDATE_SELECTED_ASSET_AMOUNT:
            return {
                ...state,
                selectedAssetAmount: action.data,
            };
        case ActionTypes.UPDATE_LATEST_BUY_QUOTE:
            return {
                ...state,
                latestBuyQuote: action.data,
                quoteState: AsyncProcessState.SUCCESS,
            };
        case ActionTypes.UPDATE_BUY_QUOTE_STATE_PENDING:
            return {
                ...state,
                latestBuyQuote: undefined,
                quoteState: AsyncProcessState.PENDING,
            };
        case ActionTypes.UPDATE_BUY_QUOTE_STATE_FAILURE:
            return {
                ...state,
                latestBuyQuote: undefined,
                quoteState: AsyncProcessState.FAILURE,
            };
        case ActionTypes.UPDATE_SELECTED_ASSET_BUY_STATE:
            return {
                ...state,
                buyOrderState: action.data,
            };
        case ActionTypes.SET_ERROR:
            return {
                ...state,
                latestError: action.data,
                latestErrorDisplay: LatestErrorDisplay.Present,
            };
        case ActionTypes.HIDE_ERROR:
            return {
                ...state,
                latestErrorDisplay: LatestErrorDisplay.Hidden,
            };
        case ActionTypes.CLEAR_ERROR:
            return {
                ...state,
                latestError: undefined,
                latestErrorDisplay: LatestErrorDisplay.Hidden,
            };
        case ActionTypes.UPDATE_SELECTED_ASSET:
            const newSelectedAssetData = action.data;
            let newSelectedAsset: Asset | undefined;
            if (!_.isUndefined(newSelectedAssetData)) {
                newSelectedAsset = assetUtils.createAssetFromAssetData(
                    newSelectedAssetData,
                    state.assetMetaDataMap,
                    state.network,
                );
            }
            return {
                ...state,
                selectedAsset: newSelectedAsset,
            };
        default:
            return state;
    }
};
