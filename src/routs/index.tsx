import * as React from 'react';

import {Route, Switch, RouteComponentProps} from 'react-router-dom';

import {default as Routs} from '../pages/routs';
import {Metadata} from '../types';

interface Pages {
  [key: string]: {
    page: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
    metadata: Metadata;
  };
}

export const PAGES: Pages = new Proxy(
    Routs || {},
    {
      get(obj: Pages, prop: string) {
        return prop in obj ? obj[prop] : obj['*'];
      },
    },
);

export default (
    <Switch>
      {Object.keys(PAGES).map((v: string) => {
        return (
            <Route
                key={v}
                exact={true}
                title={PAGES[v].metadata.menu}
                path={v}
                component={PAGES[v].page}
            />
        );
      })}
    </Switch>
);
