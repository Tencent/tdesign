import { createPopper } from '@popperjs/core';

let preSelectedText = '';
let sdkInstance;
let isGeneratingDemo = false;
let regExp = {
  vue: /```vue(?:\w+)?\s*([\s\S]*?)```/g,
};

let frameworkKeys = {
  react: 'tdesign-react',
  vue: 'tdesign-vue-next,vue3',
  miniprogram: 'tdesign-miniprogram',
  'mobile-vue': 'tdesign-mobile-vue,vue3',
  'mobile-react': 'tdesign-mobile-react',
};

let promptForGenerateDemo = {
  react: '请为我生成 ${component} 组件 ${selectedText} 属性的使用示例',
  vue: '请为我生成 ${component} 组件的 ${selectedText} 属性的使用示例，采用 script setup 语法糖',
  miniprogram: '请按照微信原生小程序代码规范，为我生成 ${component} 组件的 ${selectedText} 属性的使用示例，输出完整可用的代码片段，包括 wxml、wxss（可选）、js（可选）、json（可选）等文件',
  'mobile-vue': '请为我生成 ${component} 组件的 ${selectedText} 属性的使用示例，采用 script setup 语法糖',
  'mobile-react': "请为我生成 ${component} 组件的 ${selectedText} 属性的使用示例"
}

const generatePrompt = (framework, component, selectedText) => {
  const template = promptForGenerateDemo[framework];
  if (!template) return '';

  const REGEXP = /\$\{(\w+)\}/g;

  return template.replace(REGEXP, (match, key) => {
    const replacements = { component, selectedText };
    return replacements[key] || match;
  });
};

const createSDKContainer = (framework, demoRequestBody) => {
  if (window.WebChatSdk) {
    sdkInstance = new window.WebChatSdk({
      logo: 'https://cdc.cdn-go.cn/tdc/latest/images/tdesign.svg',
      logoLarge: 'https://cdc.cdn-go.cn/tdc/latest/images/tdesign.svg',
      style: {
        background: 'linear-gradient(117deg, #E4FFEE 0%, #B3EAFF 17.08%, #EAE7FF 45.83%, #FFF2F9 83.33%)',
      },
      knowledgeBase: '#TDesign',
      keywords: frameworkKeys[framework],
    });
    sdkInstance.sendMessage({
      prompt: '',
    });
    webChatInteraction(framework, demoRequestBody);
  }
};
// create AI search SDK
const createAISearchSDK = (framework, demoRequestBody) => {
  const searchSDK = document.getElementById('ai-search-sdk');
  const sdkContainer = document.getElementsByClassName('webchat-sdk-iframe-container');

  if (searchSDK && sdkContainer.length && sdkInstance) {
    sdkInstance.sendMessage({
      prompt: '',
    });
    return;
  }

  const sdkScript = document.createElement('script');
  sdkScript.setAttribute('src', 'https://acc-1258344699.cos.accelerate.myqcloud.com/web/webchat/sdk.js');
  sdkScript.setAttribute('id', 'ai-search-sdk');

  sdkScript.onload = () => {
    createSDKContainer(framework, demoRequestBody);
  };
  // for IE
  sdkScript.onreadystatechange = function () {
    if (this.readyState === 'loaded' || this.readyState === 'complete') {
      createSDKContainer(framework, demoRequestBody);
    }
  };

  document.body.appendChild(sdkScript);
};

const unmountTooltips = () => {
  document.querySelectorAll('#webChatInteraction').forEach?.((item) => {
    item.remove();
  });
};

// send message to AI search SDK
const sendMessage = (prompt) => {
  sdkInstance.sendMessage({
    prompt,
  });
};

// create tooltips when double click
const createTooltips = (framework, generateDemo, selectedText) => {
  const tooltip = document.createElement('div');
  const svg = document.createElement('img');
  const content = document.createElement('div');

  tooltip.setAttribute('id', 'webChatInteraction');
  tooltip.setAttribute('class', 'TDesign-ai-button__tooltip');
  tooltip.setAttribute(
    'style',
    'cursor: pointer;border: 1px solid #e9e9f1;padding: 6px 12px;border-radius: 8px;color: var(--text-primary);font-weight: bold;background-color: var(--bg-color-docpage);z-index: 9999;display: flex;',
  );

  tooltip.setAttribute('role', 'tooltip');

  const info = location.pathname.split('/');
  // const framework = info[1];
  const component = info[3];
  isGeneratingDemo = generateDemo;
  content.innerHTML = generateDemo ? '生成示例' : '划词解释';
  svg.setAttribute('src', 'https://tdesign.gtimg.com/demo/interpretation.svg');
  svg.setAttribute('style', 'margin-right: 6px;');
  document.body.appendChild(tooltip);
  tooltip.appendChild(svg);
  tooltip.appendChild(content);

  tooltip.addEventListener('mousedown', () => {
    unmountTooltips();
    let prompt = '';
    if (generateDemo) {
      prompt = generatePrompt(framework, component, selectedText);
    } else {
      prompt = component ? `请为我解释${component}的${selectedText}的定义` : `请为我解释${selectedText}的定义`;
    }
    sendMessage(prompt);
  });
  return tooltip;
};

const webChatInteraction = (framework, demoRequestBody) => {
  const codeRegex = regExp[framework];
  let body = JSON.parse(demoRequestBody);
  if (window.webChatSdk) {
    sdkInstance.onChatEnd((payload) => {
      let match;
      while ((match = codeRegex.exec(payload.content)) !== null) {
        const code = match[1];
        body = {
          ...body,
          files: {
            ...body.files,
            'src/demo.vue': {
              content: code,
            },
          },
        };
        if (!isGeneratingDemo) return;
        fetch('https://codesandbox.io/api/v1/sandboxes/define?json=1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(body),
        })
          .then((x) => x.json())
          .then(({ sandbox_id: sandboxId }) => {
            window.open(`https://codesandbox.io/s/${sandboxId}?file=/src/demo.vue`);
          });
      }
    });
  }

  document.addEventListener('mouseup', function (event) {
    const urlParams = new URLSearchParams(location.search);
    const contentDom = document.querySelector('td-doc-content');
    // 获取选中的文本
    const selectedText = window.getSelection().toString().trim();
    if (!contentDom.contains(event.target) || !selectedText) {
      unmountTooltips();
      return;
    }
    unmountTooltips();

    // 移除节点
    if (preSelectedText && preSelectedText === selectedText) return;

    preSelectedText = selectedText;
    const target = event.target;
    const isGenerateDemo =
      ['api'].includes(urlParams.get('tab')) &&
      target.tagName === 'TD' &&
      Array.from(target.parentNode.childNodes).filter((node) => node.nodeType === 1)[0] === target;
    const popper = createTooltips(framework, isGenerateDemo, selectedText);
    createPopper(event.target, popper, {
      placement: 'top',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: () => [-(event.offsetX / 4), -(event.offsetY / 2)],
          },
        },
      ],
    });
  });
};

export { webChatInteraction, createAISearchSDK };
