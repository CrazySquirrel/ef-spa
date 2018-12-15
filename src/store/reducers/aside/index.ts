import {Action, createAction, handleActions} from 'redux-actions';

export enum Type {
  MENU,
  LANGUAGE,
}

export interface AsideStore {
  aside: Type;
}

export const AsideAction = {
  aside: createAction('ASIDE_UPDATE', (aside: Type) => aside),
};

export const AsideHandle = handleActions({
  [AsideAction.aside.toString()](state: AsideStore, {payload}: Action<Type>) {
    return {
      ...state,
      aside: payload,
    };
  },
}, {});
