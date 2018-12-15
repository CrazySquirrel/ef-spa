import * as React from 'react';
import {shallow} from 'enzyme';

import Main from './index';

describe('Main', () => {
  it('render', () => {
    const result = shallow(<Main/>);

    expect(result).toMatchSnapshot();
  });
});
