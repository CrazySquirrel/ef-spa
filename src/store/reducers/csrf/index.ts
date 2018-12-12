import {handleActions} from 'redux-actions';

export interface CSRFStore {
  csrf: string;
}

export const CSRFAction = {};

export const CSRFHandle = handleActions({}, {});
