declare const window: any;
declare const global: any;

import {createStore, compose} from 'redux';
import {Action} from 'redux-actions';

import {CSRFHandle, CSRFStore} from 'store/reducers/csrf/index';

const localWindow: any = typeof window === 'undefined' ? (typeof global === 'undefined' ? global : {}) : window;

export interface StoreTree extends CSRFStore {
  modified: string;
}

const Handlers = [
  CSRFHandle,
];

const composeEnhancers = localWindow.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const Store = createStore(
    (state: StoreTree, action: Action<{}>): StoreTree => {
      return Handlers.reduce(
          (newState: StoreTree, handler: (...props: any[]) => any) => handler(newState, action),
          state,
      ) as StoreTree;
    },
    localWindow.__PRELOADED_STATE__ || {
      csrf: '',
    },
    composeEnhancers(),
);
