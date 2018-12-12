import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';

import {Store} from './store';

import Router from './routs';

import './scss/index.scss';

ReactDOM.hydrate(
    <Provider store={Store}>
      <BrowserRouter>
        {Router}
      </BrowserRouter>
    </Provider>,
    document.getElementById('root'),
);
