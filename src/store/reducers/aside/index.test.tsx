import {AsideHandle, AsideAction, Type} from './index';

describe('Aside', () => {
  it('reduce - type - menu', () => {
    const action = {
      type: AsideAction.aside.toString(),
      payload: Type.MENU,
    };

    expect(AsideHandle({}, action)).toEqual({aside: Type.MENU});
  });

  it('reduce - type - language', () => {
    const action = {
      type: AsideAction.aside.toString(),
      payload: Type.LANGUAGE,
    };

    expect(AsideHandle({}, action)).toEqual({aside: Type.LANGUAGE});
  });
});
