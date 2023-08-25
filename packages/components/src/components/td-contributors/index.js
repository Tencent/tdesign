import { html, define } from 'hybrids';
import style from './style.less';

const apiUrl = 'https://service-edbzjd6y-1257786608.hk.apigw.tencentcs.com/release/github-contributors/list';

function renderContributors(list) {
  if (!list.length) return html``;

  const contributors = list.filter((item) => (typeof item === 'object' && item !== null));

  return html`
    <section class="TDesign-contributors">
      <h3 class="title">Contributors</h3>
      <div class="TDesign-contributors__content">
        ${contributors.map((item) => html`
          <td-avatar username="${item?.username}" content="${item?.roleNames} ${item?.username}"></td-avatar>
        `)}
      </div>
    </section>
  `;
}

function getContributors(platform, framework, componentName, contributorsData) {
  const taskReg = new RegExp(`api|interaction|design|ui|^${framework}$|${framework}-test`);

  if (!platform || !framework || !componentName || !contributorsData[platform]) return [];

  const componentInfo = contributorsData[platform].find((item) => item.name === componentName);
  if (!componentInfo) return [];

  let { tasks } = componentInfo;
  tasks = tasks.filter((item) => item.name.search(taskReg) !== -1 && item.contributors.length > 0);

  const members = {};
  tasks.forEach((c) => {
    ['contributors', 'pmcs'].forEach(key => {
      c[key].forEach((m) => {
        if (members[m]) {
          members[m].role.push(c.name);
          members[m].roleName.push(c.fullName);
        } else {
          members[m] = { role: [c.name], roleName: [c.fullName] };
        }
      });
    })
  });

  return Object.keys(members).map((username) => {
    return {
      username,
      roleNames: [...new Set(members[username].roleName)].join('/'),
      ...members[username],
    };
  });
}

export default define({
  tag: 'td-contributors',
  platform: '',
  framework: '',
  componentName: '',
  contributorsData: {
    get: (host, lastValue) => lastValue || {},
    set: (host, value) => value,
    connect: (host, key, invalidate) => {
      const cache = sessionStorage.getItem('__tdesign_contributors__');

      if (cache) {
        const data = JSON.parse(cache);
        Object.assign(host, { [key]: data });
        invalidate();
      } else {
        fetch(apiUrl).then((res) => res.json())
          .then((data) => {
            Object.assign(host, { [key]: data });
            sessionStorage.setItem('__tdesign_contributors__', JSON.stringify(data));
            invalidate();
          }).catch(err => {
            console.error(err);
          });
      }
    },
  },
  render: (host) => {
    const { platform, framework, componentName } = host;

    const contributors = getContributors(platform, framework, componentName, host.contributorsData);
    return renderContributors(contributors).css`${style}`;
  },
});
