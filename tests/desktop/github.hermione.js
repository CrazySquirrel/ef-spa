describe('Main page', function () {
  it('root', function () {
    return this.browser
    .url('https://ef-spa.crazysquirrel.ru/')
    .assertView('plain', '#root');
  });
});