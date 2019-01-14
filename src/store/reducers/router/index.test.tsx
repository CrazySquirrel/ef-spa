import {RouteAction, RouteHandle} from './index';

describe('Router', () => {
  const action = {
    type: RouteAction.update.toString(),
  };

  it('reduce - location - /', () => {
    expect(RouteHandle({}, {
      ...action,
      payload: '/',
    })).toEqual({location: '/'});
  });

  it('reduce - location - /test/', () => {
    expect(RouteHandle({}, {
      ...action,
      payload: '/test/',
    })).toEqual({location: '/test/'});
  });
});
