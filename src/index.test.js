import { ScreenReaderStatusMessage } from './index';

describe('public package entry', () => {
  test('exports the status message component', () => {
    expect(ScreenReaderStatusMessage).toBeTypeOf('function');
  });
});
