import * as React from 'react';

import {shallow} from 'enzyme';

import {Icon, IconChat} from './index';

describe('Icons', () => {
  it('IconChat', () => {
    expect(shallow(<IconChat/>)).toMatchSnapshot();
  });

  it('Icon', () => {
    expect(Icon({
      id: 'test',
      viewBox: '0 0 100 100',
    }, {})).toMatchSnapshot();
  });
});
