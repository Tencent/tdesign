import qs from 'qs';

export interface QueryType {
  lang?: 'en-US' | 'zh-CN';
  repo?: string
}

export const getQuery = () => {
  return qs.parse(window.location.search.slice(1)) as QueryType;
};

export const updateQuery = (query: QueryType) => {
  const { origin, pathname } = window.location;
  const newUrl =
    origin +
    pathname +
    '?' +
    qs.stringify({ ...getQuery(), ...query }, { encode: false });
  window.history.pushState(
    {
      path: newUrl,
    },
    '',
    newUrl
  );
};
