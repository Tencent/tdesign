const fs = require('fs');
const path = require('path');

const RELEASE_API =
  'https://service-edbzjd6y-1257786608.hk.apigw.tencentcs.com/release/github-contributors/release';

const DEFAULT_RESPONSE = { vue: [], 'vue-next': [], react: [], miniprogram: [] };

function getFeatures(release) {
  const result = DEFAULT_RESPONSE;
  const frameworkReg = /##\s([\s\S]+?)详情见/g;
  const frameworks = release.match(frameworkReg);
  frameworks.forEach((item) => {
    // 获取框架标题
    const titleReg = /## (\w+) for/;
    const title = (item.match(titleReg) || [])[1];
    if (!title) return;

    // 提取 Features
    const featureReg = /### 🚀 Features([\s\S]+?)(### 🐞|详情见)/g;
    const features = item.match(featureReg);
    if (!features) return;

    // 提取 Features 中的组件
    const featComponents = features[0].match(/- `(\w+)`/g);
    const updateComponents = featComponents.map((item) => item.slice(3, -1));

    let key = title.toLowerCase();
    if (key === 'vue2') key = 'vue';
    if (key === 'vue3') key = 'vue-next';

    result[key] = updateComponents;
  });

  return result;
}

fetch(RELEASE_API)
  .then((res) => res.json())
  .then((res) => {
    const latestRelease = res[0].body;
    const result = getFeatures(latestRelease);
    console.log('update components: ', result)
    fs.writeFileSync(path.resolve(__dirname, './components-notice.json'), JSON.stringify(result, null, 2))
  });
