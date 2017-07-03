import * as _ from 'lodash';
import * as Web3 from 'web3';
import {EventCallback, ContractEventArg, ContractEvent, ContractEventObj, ContractEventEmitter} from '../types';
import * as BigNumber from 'bignumber.js';
import promisify = require('es6-promisify');

export const eventUtils = {
    /**
     * Wraps eventCallback function so that all the BigNumber arguments are wrapped in a newer version of BigNumber.
     * @param eventCallback     Event callback function to be wrapped
     * @return Wrapped event callback function
     */
    getBigNumberWrappingEventCallback(eventCallback: EventCallback): EventCallback {
        const bignumberWrappingEventCallback = (err: Error, event: ContractEvent) => {
            if (_.isNull(err)) {
                const wrapIfBigNumber = (value: ContractEventArg): ContractEventArg => {
                    // HACK: The old version of BigNumber used by Web3@0.19.0 does not support the `isBigNumber`
                    // and checking for a BigNumber instance using `instanceof` does not work either. We therefore
                    // compare the constructor functions of the possible BigNumber instance and the BigNumber used by
                    // Web3.
                    const web3BigNumber = (Web3.prototype as any).BigNumber;
                    const isWeb3BigNumber = web3BigNumber.toString() === value.constructor.toString();
                    return isWeb3BigNumber ?  new BigNumber(value) : value;
                };
                event.args = _.mapValues(event.args, wrapIfBigNumber);
            }
            eventCallback(err, event);
        };
        return bignumberWrappingEventCallback;
    },
    wrapEventEmitter(event: ContractEventObj): ContractEventEmitter {
        const watch = (eventCallback: EventCallback) => {
            const bignumberWrappingEventCallback = eventUtils.getBigNumberWrappingEventCallback(eventCallback);
            event.watch(bignumberWrappingEventCallback);
        };
        const zeroExEvent = {
            watch,
            stopWatchingAsync: async () => {
                await promisify(event.stopWatching, event)();
            },
        };
        return zeroExEvent;
    },
};
