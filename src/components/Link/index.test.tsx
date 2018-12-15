import * as React from 'react';
import {shallow} from 'enzyme';

import Link from './index';

describe('Link', () => {
  it('render', () => {
    const result = shallow(<Link/>);

    expect(result).toMatchSnapshot();
  });
});
