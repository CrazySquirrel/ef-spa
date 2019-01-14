declare const window: any;
declare const global: any;

import {createStore, compose} from 'redux';
import {Action} from 'redux-actions';

import {RouteHandle, RouteStore} from 'store/reducers/router/index';
import {AsideHandle, AsideStore} from 'store/reducers/aside/index';
import {CSRFHandle, CSRFStore} from 'store/reducers/csrf/index';

// istanbul ignore next
export const localWindow: any = typeof window === 'undefined' ? (typeof global === 'undefined' ? global : {}) : window;

export interface StoreTree extends RouteStore,
    AsideStore,
    CSRFStore {
  modified: string;
}

export const Handlers = [
  RouteHandle,
  AsideHandle,
  CSRFHandle,
];

export const composeEnhancers = localWindow.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const DefaultStore = {
  modified: '',

  location: '/',

  csrf: '',
};

export const Store = createStore(
    (state: StoreTree, action: Action<{}>): StoreTree => {
      return Handlers.reduce(
          (newState: StoreTree, handler: (...props: any[]) => any) => handler(newState, action),
          state,
      ) as StoreTree;
    },
    localWindow.__PRELOADED_STATE__ || DefaultStore,
    composeEnhancers(),
);
