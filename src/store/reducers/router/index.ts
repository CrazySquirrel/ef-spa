import {Action, createAction, handleActions} from 'redux-actions';

export interface RouteStore {
  location: string;
}

export const RouteAction = {
  update: createAction('ROUTE_UPDATE', (location: string) => location),
};

export const RouteHandle = handleActions({
  [RouteAction.update.toString()](state: RouteStore, {payload}: Action<string>) {
    return {
      ...state,
      location: payload,
    };
  },
}, {});
