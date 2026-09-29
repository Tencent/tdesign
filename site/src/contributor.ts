const CONTRIBUTORS_API = 'https://service-edbzjd6y-1257786608.hk.apigw.tencentcs.com/release/github-contributors/list';

interface Contributor {
  name: string;
  count: number;
}

function renderList(userList: string[]) {
  const list = document.querySelector<HTMLDivElement>('#list');
  if (!list) return;

  const fragment = document.createDocumentFragment();
  userList.forEach((name) => {
    const link = document.createElement('a');
    link.href = `https://github.com/${encodeURIComponent(name)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.title = name;
    link.dataset.githubId = name;
    link.ariaLabel = name;

    const image = document.createElement('img');
    image.src = `https://avatars.githubusercontent.com/${encodeURIComponent(name)}`;
    image.alt = name;
    link.append(image);
    fragment.append(link);
  });

  list.replaceChildren(fragment);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

fetch(CONTRIBUTORS_API)
  .then((response) => response.json() as Promise<unknown>)
  .then((data) => {
    const users = new Map<string, Contributor>();

    function addUsers(names: unknown) {
      if (!Array.isArray(names)) return;
      names.forEach((name) => {
        const trimmed = String(name).trim();
        if (!trimmed) return;

        const key = trimmed.toLowerCase();
        const existing = users.get(key);
        if (existing) {
          existing.count += 1;
        } else {
          users.set(key, { name: trimmed, count: 1 });
        }
      });
    }

    function collectTaskUsers(value: unknown) {
      if (Array.isArray(value)) {
        value.forEach(collectTaskUsers);
        return;
      }
      if (!isRecord(value)) return;

      addUsers(value.contributors);
      addUsers(value.pmcs);
      Object.entries(value).forEach(([key, child]) => {
        if (!['contributors', 'pmcs', 'design'].includes(key)) collectTaskUsers(child);
      });
    }

    if (isRecord(data) && isRecord(data.design)) {
      Object.values(data.design).forEach(addUsers);
    }
    collectTaskUsers(data);

    renderList(
      Array.from(users.values())
        .sort((a, b) => b.count - a.count)
        .map(({ name }) => name),
    );
  })
  .catch((error: unknown) => console.error(error));
