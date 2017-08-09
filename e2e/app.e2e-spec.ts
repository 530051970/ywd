import { YwdPage } from './app.po';

describe('ywd App', () => {
  let page: YwdPage;

  beforeEach(() => {
    page = new YwdPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
