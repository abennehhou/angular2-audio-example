import { Angular2AudioExamplePage } from './app.po';

describe('angular2-audio-example App', function() {
  let page: Angular2AudioExamplePage;

  beforeEach(() => {
    page = new Angular2AudioExamplePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
