import * as React from 'react';

import {Route, Switch} from 'react-router-dom';

import App from 'components/App';
import Unexist from 'components/Unexist';

export default (
    <Switch>
      <Route
          exact={true}
          path='/'
          component={App}
      />
      <Route
          path='*'
          component={Unexist}
      />
    </Switch>
);
