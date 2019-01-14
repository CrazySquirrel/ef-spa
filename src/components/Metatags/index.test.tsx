import * as React from 'react';
import {shallow} from 'enzyme';

import {Author, Publisher} from './index';

import {siastrebov} from '../../authors';

describe('Author', () => {
  it('render', () => {
    expect(shallow(<Author {...siastrebov}/>)).toMatchSnapshot();
  });
});

describe('Publisher', () => {
  it('render', () => {
    expect(shallow(<Publisher/>)).toMatchSnapshot();
  });
});
