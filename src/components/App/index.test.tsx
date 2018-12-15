import * as React from 'react';
import {shallow} from 'enzyme';

import {App} from './index';

describe('App', () => {
  it('render', () => {
    const result = shallow(<App/>);

    expect(result).toMatchSnapshot();
  });
});
