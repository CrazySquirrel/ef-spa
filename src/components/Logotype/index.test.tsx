import * as React from 'react';
import {shallow} from 'enzyme';

import Logotype from './index';

describe('Logotype', () => {
  it('render', () => {
    expect(shallow(<Logotype/>)).toMatchSnapshot();
  });
});
