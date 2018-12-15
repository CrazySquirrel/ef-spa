import * as React from 'react';
import {shallow} from 'enzyme';

import {Author, Publisher} from './index';

import {siastrebov} from '../../authors';

describe('Author', () => {
  it('render', () => {
    const result = shallow(<Author {...siastrebov}/>);

    expect(result).toMatchSnapshot();
  });
});

describe('Publisher', () => {
  it('render', () => {
    const result = shallow(<Publisher/>);

    expect(result).toMatchSnapshot();
  });
});
