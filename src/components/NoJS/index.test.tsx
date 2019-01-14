import * as React from 'react';
import {shallow} from 'enzyme';

import NoJS from './index';

describe('NoJS', () => {
  it('render', () => {
    expect(shallow(<NoJS/>)).toMatchSnapshot();
  });

  it('render storybook', () => {
    (global as any).target = 'storybook';

    expect(shallow(<NoJS/>)).toMatchSnapshot();
  });
});
