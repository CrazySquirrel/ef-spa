import * as React from 'react';
import {shallow} from 'enzyme';

import Boundary from './index';

describe('Boundary', () => {
  it('render', () => {
    const result = shallow(<Boundary/>);

    expect(result).toMatchSnapshot();
  });
});
