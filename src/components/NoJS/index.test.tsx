import * as React from 'react';
import {shallow} from 'enzyme';

import NoJS from './index';

describe('NoJS', () => {
  it('render', () => {
    const result = shallow(<NoJS/>);

    expect(result).toMatchSnapshot();
  });
});
