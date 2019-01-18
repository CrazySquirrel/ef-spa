import * as React from 'react';
import {shallow, ShallowWrapper} from 'enzyme';

import Boundary from './index';

describe('Boundary', () => {
  it('render', () => {
    expect(shallow(<Boundary/>)).toMatchSnapshot();
  });

  describe('When no JS errors are caught in a child component', () => {
    let BoundaryComponent: ShallowWrapper;

    beforeAll(() => {
      BoundaryComponent = shallow(<Boundary><h1>test</h1></Boundary>);
    });

    it('should render the child component', () => {
      expect(BoundaryComponent.find('h1').exists()).toBeTruthy();
    });
  });

  describe('When a JS error is caught in a child component', () => {
    let BoundaryComponent: ShallowWrapper;

    beforeAll(() => {
      jest.spyOn(global.console, 'log');

      BoundaryComponent = shallow(<Boundary><h1>test</h1></Boundary>);

      BoundaryComponent.instance().componentDidCatch(
          new Error('oh nooos an error'),
          {
            componentStack: '',
          },
      );

      BoundaryComponent.update();
    });

    it('should update the state to indicate an error', () => {
      expect((BoundaryComponent.instance().state as any).error).toBeTruthy();
    });

    it('should not render the child component', () => {
      expect(BoundaryComponent.find('h1').exists()).toBeFalsy();
    });
  });
});
