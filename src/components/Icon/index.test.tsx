import * as React from 'react';
import {shallow} from 'enzyme';

import {IconChat} from './index';

describe('IconChat', () => {
  it('render', () => {
    const result = shallow(<IconChat/>);

    expect(result).toMatchSnapshot();
  });
});
