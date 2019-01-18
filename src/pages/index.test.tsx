import * as React from 'react';

import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';

import {mount} from 'enzyme';

import {default as Routs} from './routs';

import {DefaultStore} from 'store/index';

import configureStore from 'redux-mock-store';

const mockStore = configureStore();

describe('Routs', () => {
  Object.keys(Routs).forEach((url) => {
    it(url, () => {
      const Page = (Routs as any)[url].page;

      const store = mockStore(DefaultStore);

      const spy = jest.spyOn(Page.prototype, 'render');

      const component = mount(<Provider store={store}><BrowserRouter><Page/></BrowserRouter></Provider>);

      expect(spy).toHaveBeenCalled();

      component.unmount();
    });
  });
});
