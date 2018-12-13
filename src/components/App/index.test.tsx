import * as React from 'react';
import { shallow } from 'enzyme';

import App from './index';

it('renders the heading', () => {
  const result = shallow(<App />);
  
  expect(result).toMatchSnapshot();
});
