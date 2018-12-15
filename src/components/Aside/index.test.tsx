import * as React from 'react';
import {shallow} from 'enzyme';

import {Aside} from './index';

describe('Aside', () => {
  it('render', () => {
    const result = shallow(<Aside/>);

    expect(result).toMatchSnapshot();
  });
});
