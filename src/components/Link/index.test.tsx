import * as React from 'react';
import {shallow} from 'enzyme';

import Link from './index';

describe('Link', () => {
  it('render', () => {
    expect(shallow(<Link/>)).toMatchSnapshot();
    expect(shallow(<Link to='http://test.ru'/>)).toMatchSnapshot();
    expect(shallow(<Link replaceClassName='test'/>)).toMatchSnapshot();
    expect(shallow(<Link replaceClassName='test' to='http://test.ru'/>)).toMatchSnapshot();
  });

  it('render storybook', () => {
    (global as any).target = 'storybook';

    expect(shallow(<Link/>)).toMatchSnapshot();
    expect(shallow(<Link to='http://test.ru'/>)).toMatchSnapshot();
    expect(shallow(<Link replaceClassName='test'/>)).toMatchSnapshot();
    expect(shallow(<Link replaceClassName='test' to='http://test.ru'/>)).toMatchSnapshot();
  });
});
