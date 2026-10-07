import { html, define } from 'hybrids';
import style from './style.less?inline';

const apiUrl = import.meta.env.VITE_CONTRIBUTORS_API_URL;

interface Contributor {
  username: string;
  roleNames: string;
  role: string[];
  roleName: string[];
}

interface ContributorTask {
  name: string;
  fullName: string;
  contributors: string[];
  pmcs: string[];
}

interface ComponentContributors {
  name: string;
  tasks: ContributorTask[];
}

type ContributorsData = Record<string, ComponentContributors[]>;

interface ContributorsProps {
  platform: string;
  framework: string;
  componentName: string;
  contributorsData: ContributorsData;
}

function renderContributors(list: Contributor[]) {
  if (!list.length) return html``;

  return html`
    <section class="TDesign-contributors">
      <h3 class="title">Contributors</h3>
      <div class="TDesign-contributors__content">
        ${list.map(
          (item) => html`
            <td-avatar username="${item?.username}" content="${item?.roleNames} ${item?.username}"></td-avatar>
          `,
        )}
      </div>
    </section>
  `;
}

function getContributors(
  platform: string,
  framework: string,
  componentName: string,
  contributorsData: ContributorsData,
): Contributor[] {
  const taskReg = new RegExp(`api|interaction|design|ui|^${framework}$|${framework}-test`);

  if (!platform || !framework || !componentName || !contributorsData[platform]) return [];

  const componentInfo = contributorsData[platform].find((item) => item.name === componentName);
  if (!componentInfo) return [];

  let { tasks } = componentInfo;
  tasks = tasks.filter((item) => item.name.search(taskReg) !== -1 && item.contributors.length > 0);

  const members = new Map<string, { role: string[]; roleName: string[] }>();
  tasks.forEach((c) => {
    (['contributors', 'pmcs'] as const).forEach((key) => {
      c[key].forEach((m) => {
        const member = members.get(m);
        if (member) {
          member.role.push(c.name);
          member.roleName.push(c.fullName);
        } else {
          members.set(m, { role: [c.name], roleName: [c.fullName] });
        }
      });
    });
  });

  return Array.from(members, ([username, member]) => {
    return {
      username,
      roleNames: [...new Set(member.roleName)].join('/'),
      ...member,
    };
  });
}

export default define<ContributorsProps>({
  tag: 'td-contributors',
  platform: '',
  framework: '',
  componentName: '',
  contributorsData: {
    value: (host, v) => v || {},
    connect: (host, key, invalidate) => {
      const cache = sessionStorage.getItem('__tdesign_contributors__');

      if (cache) {
        const data = JSON.parse(cache) as ContributorsData;
        Object.assign(host, { [key]: data });
        invalidate();
      } else {
        fetch(apiUrl)
          .then((res) => res.json())
          .then((data: ContributorsData) => {
            Object.assign(host, { [key]: data });
            sessionStorage.setItem('__tdesign_contributors__', JSON.stringify(data));
            invalidate();
          })
          .catch((err) => {
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
