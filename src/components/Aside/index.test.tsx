import * as React from 'react';
import {shallow} from 'enzyme';

import {Type} from 'store/reducers/aside';

import {mapStateToProps, mapDispatchToProps, Aside} from './index';
import {StoreTree} from 'store/index';

describe('Aside', () => {
  it('render', () => {
    expect(shallow(<Aside/>)).toMatchSnapshot();
  });

  it('map state to props', () => {
    const initialState = {
      aside: Type.LANGUAGE,
    } as StoreTree;

    const mapProps = mapStateToProps(initialState);

    expect(mapProps.aside).toEqual(initialState.aside);
  });

  it('map dispatch to props', () => {
    const dispatch = jest.fn();

    mapDispatchToProps(dispatch).update(Type.MENU);

    expect(dispatch.mock.calls[0][0]).toEqual({type: 'ASIDE_UPDATE', payload: Type.MENU});
  });
});
