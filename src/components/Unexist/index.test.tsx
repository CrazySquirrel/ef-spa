import * as React from 'react';
import {shallow} from 'enzyme';

import Unexist from './index';

describe('Unexist', () => {
  it('render', () => {
    expect(shallow(<Unexist/>)).toMatchSnapshot();
  });
});
