import WebTCloudDark from '!raw-loader!../built-in/themes/web/TCloud/dark.css';
import WebTCloudExtra from '!raw-loader!../built-in/themes/web/TCloud/extra.css';
import WebTCloudLight from '!raw-loader!../built-in/themes/web/TCloud/light.css';
import WebTDesignDark from '!raw-loader!../built-in/themes/web/TDesign/dark.css';
import WebTDesignLight from '!raw-loader!../built-in/themes/web/TDesign/light.css';
import WebFont from '!raw-loader!../built-in/themes/web/common/font.css';
import WebRadius from '!raw-loader!../built-in/themes/web/common/radius.css';
import WebShadow from '!raw-loader!../built-in/themes/web/common/shadow.css';
import WebSize from '!raw-loader!../built-in/themes/web/common/size.css';

import MobileTDesignDark from '!raw-loader!../built-in/themes/mobile/TDesign/dark.css';
import MobileTDesignLight from '!raw-loader!../built-in/themes/mobile/TDesign/light.css';
import MobileFont from '!raw-loader!../built-in/themes/mobile/common/font.css';
import MobileRadius from '!raw-loader!../built-in/themes/mobile/common/radius.css';
import MobileShadow from '!raw-loader!../built-in/themes/mobile/common/shadow.css';
import MobileSpacer from '!raw-loader!../built-in/themes/mobile/common/spacer.css';

/**
 * 主题文件夹名字需要和 `RECOMMEND_THEMES` 中的 `enName` 对应
 */
export const BUILT_IN_THEMES = {
  web: {
    TDesign: {
      light: WebTDesignLight,
      dark: WebTDesignDark,
    },
    TCloud: {
      light: WebTCloudLight,
      dark: WebTCloudDark,
      extra: WebTCloudExtra,
    },
    common: {
      font: WebFont,
      radius: WebRadius,
      shadow: WebShadow,
      size: WebSize,
    },
  },
  mobile: {
    TDesign: {
      light: MobileTDesignLight,
      dark: MobileTDesignDark,
    },
    common: {
      font: MobileFont,
      radius: MobileRadius,
      shadow: MobileShadow,
      spacer: MobileSpacer,
    },
  },
};

/**
 * 移动端缺失的 Token
 */
export const MOBILE_MISSING_TOKENS = [
  '--td-brand-color-hover',
  '--td-warning-color-hover',
  '--td-error-color-hover',
  '--td-success-color-hover',
  '--td-bg-color-container-hover',
  '--td-bg-color-secondarycontainer-hover',
  '--td-bg-color-component-hover',
  '--td-brand-color-light-hover',
  '--td-warning-color-light-hover',
  '--td-error-color-light-hover',
  '--td-success-color-light-hover',
  '--td-bg-color-secondarycomponent-hover',
];
