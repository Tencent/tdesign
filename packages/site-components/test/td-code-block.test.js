/* eslint-env jest */

const mockDefine = jest.fn((definition) => definition);
const mockHtml = jest.fn(() => ({ css: jest.fn() }));
mockHtml.set = jest.fn();
const mockHighlight = jest.fn(() => 'highlighted');

jest.mock('hybrids', () => ({
  define: mockDefine,
  html: mockHtml,
}));

jest.mock('prismjs', () => ({
  highlight: mockHighlight,
  languages: { css: {} },
}));
jest.mock('../src/components/td-code-block/style.less?inline', () => '', { virtual: true });

const codeBlock = require('../src/components/td-code-block').default;

describe('td-code-block slot decoding', () => {
  beforeEach(() => {
    mockHighlight.mockClear();
  });

  function renderCode(content) {
    return codeBlock.render({
      panel: 'css',
      querySelectorAll: jest.fn(() => [{ slot: 'css', lang: 'css', innerHTML: content }]),
    });
  }

  it('renders raw percent signs without throwing a URIError', () => {
    const source = '.progress { width: 100%; }';

    expect(() => renderCode(source)).not.toThrow();
    expect(mockHighlight).toHaveBeenCalledWith(source, {}, 'css');
  });

  it('preserves support for URL-encoded slot content', () => {
    renderCode('.progress%20%7B%20width%3A%20100%25%3B%20%7D');

    expect(mockHighlight).toHaveBeenCalledWith('.progress { width: 100%; }', {}, 'css');
  });
});
