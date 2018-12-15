import {RouteAction, RouteHandle} from './index';

describe('Router', () => {
  it('reduce - location - /', () => {
    const action = {
      type: RouteAction.update.toString(),
      payload: '/',
    };

    expect(RouteHandle({}, action)).toEqual({location: '/'});
  });

  it('reduce - location - /test/', () => {
    const action = {
      type: RouteAction.update.toString(),
      payload: '/test/',
    };

    expect(RouteHandle({}, action)).toEqual({location: '/test/'});
  });
});
