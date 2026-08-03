/* eslint-env jest */

const mockSearchAlgolia = jest.fn();

jest.mock('../src/components/td-doc-search/algolia.js', () => ({
  searchAlgolia: mockSearchAlgolia,
  groupHits: jest.fn((hits) => [{ key: 'results', title: 'Results', items: hits }]),
  formatHit: jest.fn(),
}));

jest.mock('../src/components/td-doc-search/recent.js', () => ({
  listRecent: jest.fn(() => []),
}));

jest.mock('../src/components/td-doc-search/constants.js', () => ({
  DEBOUNCE_MS: 200,
  VIEW: {},
}));

const { runSearch } = require('../src/components/td-doc-search/state.js');

describe('td-doc-search request lifecycle', () => {
  beforeEach(() => {
    mockSearchAlgolia.mockReset();
  });

  it('keeps newer results when an older request fails after it completes', async () => {
    const pending = [];
    mockSearchAlgolia.mockImplementation(
      ({ query }) => new Promise((resolve, reject) => pending.push({ query, resolve, reject })),
    );

    const host = {
      _groups: [],
      _activeKey: null,
      _flatHits: [],
      _currentIndex: 0,
      _loading: false,
      _abort: null,
    };
    const newerHit = {
      __formatted: {
        url: '/vue-next/components/button',
        title: 'Button',
        subtitle: '',
        breadcrumb: '',
      },
    };

    const olderSearch = runSearch(host, 'old query');
    const newerSearch = runSearch(host, 'new query');

    pending.find((request) => request.query === 'new query').resolve([newerHit]);
    await newerSearch;

    pending.find((request) => request.query === 'old query').reject(new Error('late network failure'));
    await olderSearch;

    expect(host._flatHits).toEqual([newerHit.__formatted]);
    expect(host._loading).toBe(false);
  });
});
