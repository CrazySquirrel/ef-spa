import * as Sentry from '@sentry/browser';

declare const sentry: string;
declare const version: string;
declare const mode: string;

Sentry.init({
  dsn: sentry,
  release: version,
  environment: mode,
});

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import {HashRouter} from 'react-router-dom';

import Boundary from 'components/Boundary';

import {Store} from './store';

import Router from './routs';

import './scss/index.scss';

ReactDOM.render(
    <Boundary>
      <Provider store={Store}>
        <HashRouter>
          {Router}
        </HashRouter>
      </Provider>
    </Boundary>,
    document.getElementById('root'),
);
