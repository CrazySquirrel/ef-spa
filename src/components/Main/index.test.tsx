import * as React from 'react';
import {shallow} from 'enzyme';

import Main from './index';

describe('Main', () => {
  it('render', () => {
    expect(shallow(<Main/>)).toMatchSnapshot();
  });
});
