d<template>
  <div class="tdesign-document">
    <div class="tdesign-source-header">
      <div class="content">
        <h1>行业组件</h1>
        <div class="description">
          <p>覆盖更多业务范围，更加个性化定制的行业组件</p>
        </div>
        <!-- <div class="add">
          <a href="#">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M7.34998 8.64998V12.5H8.64998V8.64998H12.5V7.34998H8.64998V3.5H7.34998V7.34998H3.5V8.64998H7.34998Z" />
            </svg>
            <span>新增行业组件</span>
          </a>
        </div> -->
      </div>
    </div>
    <div class="tdesign-source">
      <div class="tdesign-trade-card power">
        <div class="info">
          <h2 class="title">创作者商业组件</h2>
          <p class="description">
            创作者商业组件是QQ小世界团队面向创作者领域商业化特点沉淀的一套领域组件库，在QQ小店、小店运营平台、MCN机构平台、小世界运营平台等多个业务中使用。组件库以 TDesign 为原子组件，在此基础上根据业务特点，扩展了复合组件、块级组件、模板引擎三层架构，助力业务需求快速落地。其中模板引擎抽象了表单、表格、详情页等通用场景，形成运营领域特定语言，进一步解放需求生产力。
          </p>
        </div>
        <a href="https://pd.pages.woa.com" target="_blank">
          <t-button size="large" class="action">查 看</t-button>
        </a>
      </div>
      <div class="tdesign-trade-card travel">
        <div class="info">
          <h2 class="title">文旅组件</h2>
          <p class="description">
            Tm Design
            文旅组件是腾讯地图行业创新中心在文旅方向面向文博类、乐园类等沉淀的个性化组件，在故宫、延安、广东党建等KA及微信九宫格出行等产品中落地，致力于为业务提供美好的产品设计语言和用户体验。
          </p>
        </div>
        <a href="http://tmdesign.pages.oa.com/" target="_blank">
          <t-button size="large" class="action">查 看</t-button>
        </a>
      </div>
      <div class="tdesign-trade-card education">
        <div class="info">
          <h2 class="title">教育组件</h2>
          <p class="description">
            EDesign
            教育行业组件是在教育领域沉淀的具有教育行业属性的复合功能组件。期望通过简单的配置和功能集成的高阶组件，完成教育行业通用页面的搭建和开发，比如常见表单页面、列表页面、组织架构树的创建等，让教育行业 to b 项目开发更快速更便捷。
          </p>
        </div>
        <a href="https://v.campus.qq.com/edu-design/guide/quickstart.html" target="_blank">
          <t-button size="large" class="action">查 看</t-button>
        </a>
      </div>
      <div class="tdesign-trade-card health">
        <div class="info">
          <h2 class="title">医疗健康组件</h2>
          <p class="description">
            CareDesign 医疗健康组件是腾讯在医疗健康领域服务行业场景，具有医疗属性、符合健康服务多角色诉求的设计组件。医疗健康组件跨终端、可适配、可扩展，并且已在医疗服务线上触达、医保电子凭证、电子健康卡、医疗保障惠民服务、医疗大数据可视化辅助决策平台、医院管理、临床辅助诊疗等产品中有效的验证和落地。
          </p>
        </div>
        <a href="https://caredesign.tencent.com/design-code/vue-pc/default" target="_blank">
          <t-button size="large" class="action">查 看</t-button>
        </a>
      </div>
      <div class="tdesign-trade-card safe">
        <div class="info">
          <h2 class="title">安全组件</h2>
          <p class="description">
            安全组件是腾讯企业安全团队基于行业场景标准化沉淀的应用组件。组件具备满足“预防、检测、防御、响应”功能闭环的安全场景需求；符合安全行业标准以及运维的使用诉求，可通过简单配置来满足业务的构建和扩展，让开发更加高效。
            组件现已在腾讯安全运营中心、零信任、主机安全、云防火墙、DDOS、WAF、数据安全、内容安全等云上多款基础安全以及业务安全产品中得到有效验证，并且落地使用。
          </p>
        </div>
        <a :href="safeTeamUrl" target="_blank">
          <t-button size="large" class="action">查 看</t-button>
        </a>
      </div>
      <div class="tdesign-trade-card political">
        <div class="info">
          <h2 class="title">政务组件</h2>
          <p class="description">
            是腾讯政务领域具有政务功能模式，特性的组件。其中如行政区划，组织机构选择等专为政务场景设计的复合功能组件等；政务行业组件现已在一网统管、城市体征、营商通、数据中台、AI中台、G端办公平台等产品中有效的验证和落地。
          </p>
        </div>
        <t-button size="large" class="action" theme="default" disabled>敬请期待</t-button>
      </div>
      <div class="tdesign-trade-card map">
        <div class="info">
          <h2 class="title">地图组件</h2>
          <p class="description">地图行业组件提供基于地图的操作或展示型组件，包括地图点标记、地图操作控件等。</p>
          <p class="description">支持在地图上标记多个或多类位置，同时支持流畅的缩放、旋转及俯仰角精准控制等操作。</p>
        </div>
        <t-button size="large" class="action" theme="default" disabled>敬请期待</t-button>
      </div>
    </div>
    <td-doc-footer :style="footerStyle" />
  </div>
</template>

<script>
const safeTeamUrl = import.meta.env.VITE_SAFE_TEAM_URL;

export default {
  data() {
    return {
      safeTeamUrl
    };
  },
  computed: {
    footerStyle () {
      return {
        '--content-padding-right': '0',
        '--content-max-width': '1440px',
        '--content-padding-left-right': '48px',
        '--footer-logo-position': 'unset'
      }
    }
  }
}
</script>

<style lang="less">
.tdesign-trade-card + .tdesign-trade-card {
  margin-top: 24px;
}

.tdesign-source-header {
  .add {
    position: absolute;
    right: 48px;
    bottom: 48px;
    width: 132px;
    height: 40px;
    padding: 4px;
    background: var(--bg-color-component-transparent);
    box-sizing: border-box;
    backdrop-filter: blur(10px);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: var(--popup-box-shadow);

    a {
      border-radius: var(--border-radius);
      transition: all 0.2s ease 0s;
      display: flex;
      align-items: center;
      padding: 5px 8px;
      line-height: 22px;
      color: var(--text-primary);
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s linear;

      &:hover {
        background: var(--bg-color-component-hover);
      }
    }

    svg {
      margin-right: 8px;
    }
  }
}

.tdesign-trade-card {
  --base-width: 720;

  position: relative;
  width: 100%;
  max-width: 1760px;
  height: 0;
  border-radius: 6px;
  overflow: hidden;
  padding-bottom: calc(var(--base-width) / 2688 * 100%);

  &.political {
    background-color: #f1e6e3;
    background-image: url(./assets/trade/political.png);
    background-size: 100% auto;
    background-position: right top;
    background-repeat: no-repeat;

    .info {
      background-color: #f1e6e3;
      &::before {
        background: linear-gradient(91.32deg, #f1e6e3 1.12%, rgba(241, 230, 227, 0) 101.08%);
      }
    }
  }

  &.map {
    background-color: #eaecea;
    background-image: url(./assets/trade/map.png);
    background-size: auto 100%;
    background-position: right top;
    background-repeat: no-repeat;

    .info {
      background-color: #eaecea;
      &::before {
        background: linear-gradient(91.32deg, #eaecea 1.12%, rgba(234, 236, 234, 0) 101.08%);
      }
    }
  }

  &.education {
    background-color: #E0ECE8;
    background-image: url(./assets/trade/education.png);
    background-size: auto 100%;
    background-position: right top;
    background-repeat: no-repeat;

    .info {
      background-color: #eaecea;
      &::before {
        background: linear-gradient(91.32deg, #eaecea 1.12%, rgba(234, 236, 234, 0) 101.08%);
      }
    }
  }

  &.health {
    background-color: #EBF4FF;
    background-image: url(./assets/trade/health.png);
    background-size: auto 100%;
    background-position: right top;
    background-repeat: no-repeat;
  }

  &.safe {
    background-color: #EBF4FF;
    background-image: url(./assets/trade/safe.png);
    background-size: auto 100%;
    background-position: right top;
    background-repeat: no-repeat;
  }

  &.power {
    background-color: #e3e6eb;
    background-image: url(./assets/trade/power.png);
    background-size: auto 100%;
    background-position: right top;
    background-repeat: no-repeat;

    .info {
      background-color: #e3e6eb;
      &::before {
        background: linear-gradient(91.32deg, #e3e6eb 1.12%, rgba(234, 236, 234, 0) 101.08%);
      }
    }
  }

  &.travel {
    background-color: #e3e6eb;
    background-image: url(./assets/trade/travel.png);
    background-size: auto 100%;
    background-position: right top;
    background-repeat: no-repeat;

    .info {
      background-color: #e3e6eb;
      &::before {
        background: linear-gradient(91.32deg, #e3e6eb 1.12%, rgba(234, 236, 234, 0) 101.08%);
      }
    }
  }

  .info {
    width: 40%;
    height: 0;
    position: relative;
    padding-bottom: calc(var(--base-width) / 2688 * 100% - 48px);
    padding-left: 48px;
    padding-top: 48px;
    box-sizing: border-box;

    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      left: 100%;
      top: 0;
    }

    .title {
      font-size: 36px;
      line-height: 44px;
      margin-bottom: 16px;
      color: rgba(0, 0, 0, 0.9);
    }

    .description {
      font-size: 14px;
      line-height: 22px;
      color: rgba(0, 0, 0, 0.6);
    }
  }

  .action {
    position: absolute;
    left: 48px;
    bottom: 48px;
  }

  @media screen and (max-width: 1200px) {
    .info {
      width: 90%;
      padding-top: 32px;
      padding-left: 32px;
      padding-bottom: calc(var(--base-width) / 2688 * 100% - 32px);

      .title {
        font-size: 20px;
        line-height: 28px;
        margin-bottom: 8px;
      }
    }

    .action.t-button {
      height: 32px;
      padding-left: 16px;
      padding-right: 16px;
      left: 32px;
      bottom: 32px;
    }
  }

  @media screen and (max-width: 960px) {
    --base-width: 860;
  }

  @media screen and (max-width: 750px) {
    --base-width: 1200;
  }

  @media screen and (max-width: 640px) {
    --base-width: 1800;
  }

  @media screen and (max-width: 480px) {
    --base-width: 2600;
  }

  @media screen and (max-width: 400px) {
    --base-width: 3200;
  }

  @media screen and (max-width: 320px) {
    --base-width: 4200;
  }
}
</style>
