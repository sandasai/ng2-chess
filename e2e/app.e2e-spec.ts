import { Ng2ChessPage } from './app.po';

describe('ng2-chess App', function() {
  let page: Ng2ChessPage;

  beforeEach(() => {
    page = new Ng2ChessPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
