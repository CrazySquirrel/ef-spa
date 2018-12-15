import {prop, guid} from './index';

describe('Tools', () => {
  it('prop', () => {
    expect(prop({}, '', '')).toEqual('');
  });

  it('guid', () => {
    expect(guid()).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/ig);
  });
});
