<template>
  <div>
    <div class="tdesign-source">
      <section class="tdesign-source__base">
        <h2 class="title">
          <slot name="title">基础资源<span>10</span></slot>
        </h2>
        <div class="tdesign-source-block" v-for="item in baseList" :key="item.title">
          <div class="tdesign-source-block-image">
            <div @click="download(item)">
              <img class="light" :src="item.imgUrl" />
              <img class="dark" :src="item.imgUrlDark" />
            </div>
          </div>
          <div class="tdesign-source-block-title">
            {{ item.title }}
            <span
              v-if="item.status"
              :class="getStatusClass(item.status)"
            >
              {{ getStatusText(item.status) }}
            </span>
          </div>
          <div class="tdesign-source-block-detail" v-html="item.detail"></div>
        </div>
      </section>
    </div>
    <div class="tdesign-source">
      <section class="tdesign-source__util">
        <h2 class="title">
          <slot name="title">其他<span>6</span></slot>
        </h2>
        <div class="tdesign-source-block" v-for="item in utilList" :key="item.title">
          <div class="tdesign-source-block-image">
            <div @click="download(item)">
              <img class="light" :src="item.imgUrl" />
              <img class="dark" :src="item.imgUrlDark" />
            </div>
          </div>
          <div class="tdesign-source-block-title">
            {{ item.title }}
            <span
              v-if="item.status"
              :class="item.status === 1 ? 'tdesign-source-block-tag-todo' : 'tdesign-source-block-tag-waiting'"
            >
              {{ getStatusText(item.status) }}
            </span>
          </div>
          <div class="tdesign-source-block-detail" v-html="item.detail"></div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import AdobeXDWeb from './assets/Adobe-XD-Web.png'
import AdobeXDWebDark from './assets/Adobe-XD-Web-dark.png'
import AdobeXDMobile from './assets/Adobe-XD-Mobile.png'
import AdobeXDMobileDark from './assets/Adobe-XD-Mobile-dark.png'
import AxureWeb from './assets/Axure-Web.png'
import AxureWebDark from './assets/Axure-Web-dark.png'
import AxureMobile from './assets/Axure-Mobile.png'
import AxureMobileDark from './assets/Axure-Mobile-dark.png'
import FigmaWeb from './assets/Figma-Web.png'
import FigmaWebDark from './assets/Figma-Web-dark.png'
import FigmaMobile from './assets/Figma-Mobile.png'
import FigmaMobileDark from './assets/Figma-Mobile-dark.png'
import SketchWeb from './assets/Sketch-Web.png'
import SketchWebDark from './assets/Sketch-Web-dark.png'
import SketchMobile from './assets/Sketch-Mobile.png'
import SketchMobileDark from './assets/Sketch-Mobile-dark.png'
import SketchTDesignMaker from './assets/Sketch-TDesignMaker.png'
import SketchTDesignMakerDark from './assets/Sketch-TDesignMaker-dark.png'
import TDesignPixso from './assets/TDesign-Pixso.png'
import TDesignPixsoDark from './assets/TDesign-Pixso-dark.png'
import Modao from './assets/modao.png'
import ModaoDark from './assets/modao-dark.png'
import TDesignJs from './assets/TDesign-Js.png'
import TDesignJsDark from './assets/TDesign-Js-dark.png'
import CoDesign from './assets/CoDesign.png'
import CoDesignDark from './assets/CoDesign-dark.png'
import StarterUIkitPC from './assets/Starter-UIkit-pc.png'
import StarterUIkitPCDark from './assets/Starter-UIkit-pc-dark.png'
import StarterUIkitMobile from './assets/Starter-UIkit-mobile.png'
import StarterUIkitMobileDark from './assets/Starter-UIkit-mobile-dark.png'

import {
  figmaWebUrl,
  figmaMobileUrl,
  figmaWebStarterUrl,
  sketchWebUrl,
  sketchMobileUrl,
  axWebUrl,
  xdWebUrl
} from '@consts'

export default {
  data () {
    return {
      baseList: [
        {
          title: 'Figma 桌面端组件库',
          detail: '适用于中后台场景的 Figma 文件',
          status: 0,
          imgUrl: FigmaWeb,
          imgUrlDark: FigmaWebDark,
          actionUrl: figmaWebUrl
        },
        {
          title: 'Figma 移动端组件库',
          detail: '适用于移动端/小程序场景的 Figma 文件',
          status: 0,
          imgUrl: FigmaMobile,
          imgUrlDark: FigmaMobileDark,
          actionUrl: figmaMobileUrl
        },
        {
          title: 'Sketch 桌面端组件库',
          detail: '适用于中后台场景的 Sketch UI Kit',
          status: 3,
          imgUrl: SketchWeb,
          imgUrlDark: SketchWebDark,
          actionUrl: sketchWebUrl
        },
        {
          title: 'Sketch 移动端组件库',
          detail: '适用于移动端/小程序场景的 Sketch UI Kit',
          status: 0,
          imgUrl: SketchMobile,
          imgUrlDark: SketchMobileDark,
          actionUrl: sketchMobileUrl
        },
        {
          title: 'Axure 桌面端组件库',
          detail: '使用 Axure 组件库请参考<a href="https://github.com/Tencent/tdesign/blob/main/docs/design/TDesign_Axure_Library%20Guide.md" target="blank">《使用帮助》</a>',
          status: 3,
          imgUrl: AxureWeb,
          imgUrlDark: AxureWebDark,
          actionUrl: axWebUrl
        },
        {
          title: 'Axure 移动端组件库',
          detail: '适用于移动端/小程序场景的 Axure 文件',
          status: 1,
          imgUrl: AxureMobile,
          imgUrlDark: AxureMobileDark
        },
        {
          title: 'Adobe XD 桌面端组件库',
          detail: '适用于中后台场景的 XD 文件',
          status: 0,
          imgUrl: AdobeXDWeb,
          imgUrlDark: AdobeXDWebDark,
          actionUrl: xdWebUrl
        },
        {
          title: 'Adobe XD 移动端组件库',
          detail: '适用于移动端/小程序场景的 XD 文件',
          status: 1,
          imgUrl: AdobeXDMobile,
          imgUrlDark: AdobeXDMobileDark
        },
        {
          title: 'Figma 桌面端页面模板',
          detail: '适用于中后台场景的页面模板',
          status: 0,
          imgUrl: StarterUIkitPC,
          imgUrlDark: StarterUIkitPCDark,
          actionUrl: figmaWebStarterUrl
        },
        {
          title: 'Figma 移动端页面模板',
          detail: '适用于移动端/小程序场景的页面模板',
          status: 1,
          imgUrl: StarterUIkitMobile,
          imgUrlDark: StarterUIkitMobileDark
        }
      ],
      utilList: [
        {
          title: 'TDesign Maker',
          detail:
            '<span>使用 Sketch 插件请参考<a href="https://doc.weixin.qq.com/doc/w3_m_OkshgETGpoGB?scode=AJEAIQdfAAoYvGqGCUAL8AZgbdAFw" target="blank">《插件使用手册》</a></span>',
          status: 0,
          imgUrl: SketchTDesignMaker,
          imgUrlDark: SketchTDesignMakerDark,
          actionUrl: 'https://teamaker-1251887421.cos.ap-guangzhou.myqcloud.com/tdesignmaker.sketchplugin0.1.3.zip'
        },
        {
          title: 'CoDesign & TDesign',
          detail:
            '在 CoDesign 中使用请参考<a href="https://codesign.qq.com/hc/designsystem/" target="blank">《使用帮助》</a>',
          status: 0,
          imgUrl: CoDesign,
          imgUrlDark: CoDesignDark,
          actionUrl: 'https://codesign.qq.com/?utm_source=tdesign&utm_medium=tdesign'
        },
        {
          title: '即时设计 & TDesign',
          detail: '在即时设计中使用 TDesign 的组件',
          status: 0,
          imgUrl: TDesignJs,
          imgUrlDark: TDesignJsDark,
          actionUrl: 'https://js.design/resourceDetails/?id=61c19580b7b05104e240fa76'
        },
        {
          title: 'Pixso & TDesign',
          detail: '在 Pixso 中使用 TDesign 的组件',
          status: 0,
          imgUrl: TDesignPixso,
          imgUrlDark: TDesignPixsoDark,
          actionUrl: 'https://pixso.cn/community/file/rHGnmqg_TSuh_Z3y2d6IfA'
        },
        {
          title: '墨刀 & TDesign',
          detail: '在墨刀中使用 TDesign 的组件',
          status: 0,
          imgUrl: Modao,
          imgUrlDark: ModaoDark,
          actionUrl:
            'https://modao.cc/community?page=1&type=find&params=work&keyword=TDesign%E6%A1%8C%E9%9D%A2%E7%AB%AF%E7%BB%84%E4%BB%B6%E5%BA%93'
        }
      ]
    }
  },

  computed: {
    headerStyle () {
      return {
        '--bg-color-secondarypage': 'var(--bg-color-navigation)',
        '--bg-color-secondarypage-hover': 'var(--bg-color-navigation-hover)',
        '--bg-color-secondarypage-select': 'var(--bg-color-navigation-select)'
      }
    }
  },

  methods: {
    getStatusClass (status) {
      const map = { 0: '', 1: 'tdesign-source-block-tag-todo', 2: 'tdesign-source-block-tag-waiting', 3: 'tdesign-source-block-tag-new' }
      return map[status]
    },
    getStatusText (status) {
      console.log('status', status)
      const map = { 0: '', 1: '待上线', 2: '进行中', 3: '最新' }
      return map[status]
    },
    download (item) {
      if (item.actionUrl) {
        window.aegis &&
          window.aegis.reportEvent({
            name: '设计资源下载', // 必填
            ext1: item.title,
            ext2: item.actionUrl
          })
        if (window._horizon) {
          window._horizon.send('资源下载', 'click', item.title, item.actionUrl)
        }
        window.open(item.actionUrl, '_blank')
      }
    }
  }
}
</script>
