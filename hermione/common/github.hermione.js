describe('Main page', function () {
  it('root', function () {
    return this.browser
    .url('/')
    .assertView('plain', '#root');
  });
});