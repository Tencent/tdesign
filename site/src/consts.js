export const CDN_BASE = 'https://tdesign.gtimg.com'

export const figmaWebUrl = 'https://www.figma.com/community/file/1053279236128724321'
export const figmaMobileUrl = 'https://www.figma.com/community/file/1053279585699097956'
export const figmaWebStarterUrl = 'https://www.figma.com/community/file/1053279236128724321'

export const sketchWebUrl = 'https://codesign.qq.com/s/Mx86jz774n9brz3?feature_aside=resource'

export const sketchMobileUrl = `${CDN_BASE}/design-source/TDesign_Sketch_Library_Mobile_1.1.0.sketch`

// export const axWebUrl = `${CDN_BASE}/design-source/TDesign_Axure_Library_Web_1.1.0.rplib`

export const axWebUrl = 'https://codesign.qq.com/s/xDP39q3qYmZwlKp?feature_aside=resource'

export const xdWebUrl = 'https://codesign.qq.com/s/NlO1ZnlleX9LMV2?feature_aside=resource'

export const sourceDownloadUrl = 'https://oteam-tdesign-1258344706.cos-website.ap-guangzhou.myqcloud.com/api/horizon-data-all.json'

export const webSourceList = [
  {
    title: 'Figma 设计资源',
    eventLabel: 'Figma 桌面端组件库',
    actionUrl: figmaWebUrl,
    lastUpdated: '04/08/2023',
    status: 1,
    icon: 'figma',
    actionType: 'jump',
    id: 'figma_web_down'
  },
  {
    title: 'Sketch 设计资源',
    eventLabel: 'Sketch 桌面端组件库',
    actionUrl: sketchWebUrl,
    lastUpdated: '11/08/2022',
    status: 1,
    icon: 'sketch',
    actionType: 'jump',
    id: 'sketch_web_down'
  },
  {
    title: 'Axure 设计资源',
    eventLabel: 'Axure 桌面端组件库',
    actionUrl: axWebUrl,
    lastUpdated: '11/02/2022',
    status: 1,
    icon: 'axure',
    actionType: 'jump',
    id: 'axure_web_down'
  },
  {
    title: '如意设计助手 & TDesign',
    eventLabel: '如意设计助手 x TDesign 组件库',
    actionUrl: 'https://www.figma.com/community/plugin/1192146318523533547',
    lastUpdated: '07/03/2023',
    status: 1,
    icon: 'ry',
    actionType: 'jump',
    id: 'ry_tdesign_down'
  },
  {
    title: 'Mastergo 设计资源',
    eventLabel: 'Mastergo 桌面端组件库',
    actionUrl: 'https://mastergo.com/community/resource/85006181962555?from=card',
    lastUpdated: '02/03/2023',
    status: 1,
    icon: 'mastergo',
    actionType: 'jump',
    id: 'mastergo_web_down'
  },
  {
    title: 'Adobe XD 设计资源',
    eventLabel: 'Adobe XD 桌面端组件库',
    actionUrl: xdWebUrl,
    lastUpdated: '01/07/2022',
    status: 0,
    icon: 'xd',
    actionType: 'jump',
    id: 'adobe_web_down'
  },
  {
    title: 'CoDesign & TDesign',
    eventLabel: 'CoDesign x TDesign 桌面端组件库',
    actionUrl: 'https://codesign.qq.com/s/dqN2925D7qjaBXe?active-screen=xDP39qAvLNl9wlK&menu_aside=null&minimap=close',
    lastUpdated: '08/24/2022',
    status: 0,
    icon: 'codesign',
    actionType: 'jump',
    id: 'codesign_tdesign_web_down'
  },
  {
    title: '即时设计 & TDesign',
    eventLabel: '即时设计 x TDesign 桌面端组件库',
    actionUrl: 'https://js.design/resourceDetails/?id=61c19580b7b05104e240fa76',
    lastUpdated: '12/23/2021',
    status: 0,
    icon: 'jssj',
    actionType: 'jump',
    id: 'jsdesign_tdesign_web_down'
  },
  {
    title: 'Pixso & TDesign',
    eventLabel: 'Pixso x TDesign 桌面端组件库',
    actionUrl: 'https://pixso.cn/community/file/rHGnmqg_TSuh_Z3y2d6IfA',
    lastUpdated: '01/28/2022',
    status: 0,
    icon: 'pixso',
    actionType: 'jump',
    id: 'pixso_tdesign_web_down'
  },
  {
    title: '墨刀 & TDesign',
    eventLabel: '墨刀 x TDesign 桌面端组件库',
    actionUrl: 'https://modao.cc/community?page=1&type=find&order=search_order&keyword=TDesign%E6%A1%8C%E9%9D%A2%E7%AB%AF%E7%BB%84%E4%BB%B6%E5%BA%93',
    lastUpdated: '09/02/2022',
    status: 0,
    icon: 'md',
    actionType: 'jump',
    id: 'md_tdesign_web_down'
  }
]

export const mobileSourceList = [
  {
    title: 'Figma 设计资源',
    eventLabel: 'Figma 移动端组件库',
    actionUrl: figmaMobileUrl,
    lastUpdated: '05/25/2023',
    status: 1,
    icon: 'figma',
    actionType: 'jump',
    id: 'figma_mobile_down'
  },
  {
    title: 'Sketch 设计资源',
    eventLabel: 'Sketch 移动端组件库',
    actionUrl: sketchMobileUrl,
    lastUpdated: '06/02/2023',
    status: 1,
    icon: 'sketch',
    actionType: 'download',
    id: 'sketch_mobile_down'
  },
  {
    title: 'Axure 设计资源',
    eventLabel: 'Axure 移动端组件库',
    actionUrl: axWebUrl,
    lastUpdated: '待上线',
    status: -1,
    icon: 'axure',
    actionType: 'jump',
    id: 'axure_mobile_down'
  },
  {
    title: 'Adobe XD 设计资源',
    eventLabel: 'Adobe XD 移动端组件库',
    actionUrl: xdWebUrl,
    lastUpdated: '待上线',
    status: -1,
    icon: 'xd',
    actionType: 'download',
    id: 'axure_mobile_down'
  }
]

export const webChartSourceList = [
  {
    title: 'Figma 设计资源',
    eventLabel: 'TVision Charts for Figma',
    actionUrl: 'https://www.figma.com/community/file/1202507505468414219',
    lastUpdated: '06/13/2023',
    status: 1,
    icon: 'figma',
    actionType: 'jump',
    id: 'tvision_charts_web_figma_down'
  },
  {
    title: 'Sketch 设计资源',
    eventLabel: 'TVision Charts for Sketch',
    actionUrl: 'https://codesign.qq.com/s/Mx86jz7LOL9brz3?feature_aside=resource',
    lastUpdated: '02/01/2023',
    status: 1,
    icon: 'sketch',
    actionType: 'jump',
    id: 'tvision_charts_web_sketch_down'
  }
]
