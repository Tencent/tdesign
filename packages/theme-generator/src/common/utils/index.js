import { Color } from "tvision-color";
import cssbeautify from "cssbeautify";
import {
  LIGHT_FUNCTION_COLOR,
  DARK_FUNCTION_COLOR,
} from "../../color-panel/utils/const";

import generatorVariables from "!raw-loader!./vars.css"; // variables for generator
import defaultDarkVariables from "!raw-loader!./default-dark";

import { builtInThemeMap } from "../built-in/theme-map";

export * from "tdesign-vue/es/_common/js/color-picker";

export const generatorSymbol = "TDESIGN_GENERATOR_SYMBOL";

export const customTheme = "custom-theme";
export const customDarkTheme = "custom-dark-theme";

export function initVariables() {
  let styleSheet;
  let themeStylesheet = document.getElementById(generatorSymbol);

  if (!themeStylesheet) {
    styleSheet = document.createElement("style");
    styleSheet.id = generatorSymbol;
    styleSheet.innerText = generatorVariables;
    document.head.appendChild(styleSheet);
  }
}

export function appendStyleSheet(themeId) {
  let styleSheet;
  const existSheet = document.getElementById(themeId);

  if (!existSheet) {
    styleSheet = document.createElement("style");
    styleSheet.id = themeId;
    styleSheet.type = "text/css";
    document.head.appendChild(styleSheet);
  } else {
    styleSheet = existSheet;
  }
  return styleSheet;
}

// generator new theme variables and insert into document
export function generateNewTheme(hex, remainInput = true) {
  // hex 主题色
  let styleSheet = appendStyleSheet(customTheme);
  let darkStyleSheet = appendStyleSheet(customDarkTheme);

  const { brandColorIdx, colorPalette, styleSheetString } = generateTokenList(
    hex,
    false,
    10,
    remainInput
  );
  if (builtInThemeMap[hex]) {
    styleSheet.innerText = builtInThemeMap[hex];
    document.head.removeChild(darkStyleSheet);
  } else {
    const darkCssTokenString = generateTokenList(hex, true).styleSheetString;
    styleSheet.innerText = styleSheetString;
    darkStyleSheet.innerText = darkCssTokenString;
  }

  document.documentElement.setAttribute("theme-color", customTheme);
  updateBrandMain(hex);
  return { brandColorIdx, colorPalette };
}

// update `--brand-main` variable when update theme
export function updateBrandMain(hex) {
  const root = document.documentElement;
  root.style.setProperty("--brand-main", hex);
}

// generate token column
export function generateTokenList(
  hex,
  isDark = false,
  step = 10,
  remainInput = true
) {
  const lowCaseHex = hex.toLocaleLowerCase();
  const root = isDark
    ? `:root[theme-color="${customTheme}"][theme-mode="dark"]`
    : `:root[theme-color="${customTheme}"],:root[theme-color="${customTheme}"][theme-mode="light"]`;
  let colorPalette;
  let brandColorIdx;

  const [{ colors, primary }] = Color.getColorGradations({
    colors: [lowCaseHex],
    step: step,
    remainInput, // remain input or not
  });
  colorPalette = colors;
  brandColorIdx = primary;
  if (isDark) {
    if (lowCaseHex === "#0052d9") {
      colorPalette = [
        "#1b2f51",
        "#173463",
        "#143975",
        "#103d88",
        "#0d429a",
        "#054bbe",
        "#2667d4",
        "#4582e6",
        "#699ef5",
        "#96bbf8",
      ];
      brandColorIdx = 8;
    } else {
      // eslint-disable-next-line no-use-before-define
      colorPalette.reverse().map((color) => {
        const [h, s, l] = Color.colorTransform(color, "hex", "hsl");
        return Color.colorTransform([h, Number(s) - 4, l], "hsl", "hex");
      });
      brandColorIdx = 5;
    }

    colorPalette[0] = `${colorPalette[brandColorIdx]}20`;
  }
  const existSheet = document.getElementById(customTheme);
  // combine font/radius/shadow/size into new theme sheet
  const fontConfig = existSheet.innerText.match(
    /\/\* 字体配置 \*\/(.*)\/\* end 字体配置 \*\//
  )?.[0];
  const radiusConfig = existSheet.innerText.match(
    /\/\* 圆角配置 \*\/(.*)\/\* end 圆角配置 \*\//
  )?.[0];
  const shadowConfig = existSheet.innerText.match(
    /\/\* 阴影配置 \*\/(.*)\/\* end 阴影配置 \*\//
  )?.[0];
  const sizeConfig = existSheet.innerText.match(
    /\/\* 尺寸配置 \*\/(.*)\/\* end 尺寸配置 \*\//
  )?.[0];

  // TODO: 功能色、中性色未通过t-vision生成 先固定住
  const styleSheetString = `${root}{
    --brand-main: var(--td-brand-color-${brandColorIdx + 1});
    --td-brand-color-light: var(--td-brand-color-1);
    --td-brand-color-focus: var(--td-brand-color-2);
    --td-brand-color-disabled: var(--td-brand-color-3);
    --td-brand-color-hover: var(--td-brand-color-${
      brandColorIdx > 0 ? brandColorIdx : brandColorIdx + 1
    });
    --td-brand-color: var(--td-brand-color-${brandColorIdx + 1});
    --td-brand-color-active:var(--td-brand-color-${
      brandColorIdx > 8 ? brandColorIdx + 1 : brandColorIdx + 2
    });
    --td-brand-color-1: ${colorPalette[0]};
    --td-brand-color-2: ${colorPalette[1]};
    --td-brand-color-3: ${colorPalette[2]};
    --td-brand-color-4: ${colorPalette[3]};
    --td-brand-color-5: ${colorPalette[4]};
    --td-brand-color-6: ${colorPalette[5]};
    --td-brand-color-7: ${colorPalette[6]};
    --td-brand-color-8: ${colorPalette[7]};
    --td-brand-color-9: ${colorPalette[8]}; 
    --td-brand-color-10: ${colorPalette[9]};
    ${isDark ? DARK_FUNCTION_COLOR : LIGHT_FUNCTION_COLOR}
    ${isDark ? defaultDarkVariables : fontConfig}
    ${radiusConfig}${shadowConfig}${sizeConfig}
    }`;

  return { styleSheetString, brandColorIdx, colorPalette };
}

// handle export and download theme
export function handleDownload() {
  const styleSheet = document.getElementById(customTheme);
  const darkStyleSheet = document.getElementById(customDarkTheme);
  const hex = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("--td-brand-color")
    .toLocaleUpperCase()
    .trim();

  let cssVariablesString = styleSheet?.innerText?.replaceAll(
    `[theme-color="${customTheme}"]`,
    ""
  );
  let darkCssVariablesString = darkStyleSheet?.innerText?.replaceAll(
    `[theme-color="${customTheme}"]`,
    ""
  );

  const finalCssVariablesString = builtInThemeMap[hex]
    ? cssVariablesString
    : `${cssVariablesString}${darkCssVariablesString}`;
  if (window._horizon) {
    window._horizon.send("主题生成器主题下载", "click", hex.replace("#", ""));
  }
  const beautifyCssVariablesString = cssbeautify(finalCssVariablesString);
  const blob = new Blob([beautifyCssVariablesString], { type: "text" });
  const cssUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.download = "theme.css";
  a.target = "_blank";
  a.href = cssUrl;
  a.click();
}

// set attach node, to resolve web component shadow root dom issue
export function handleAttach() {
  return (
    document
      .querySelector("td-theme-generator")
      ?.shadowRoot?.querySelector?.(".theme-generator") || document.body
  );
}

// modify custom-theme token/variable value
export function modifyToken(tokenIdxName, res) {
  const styleSheet = document.getElementById(customTheme);
  if (!styleSheet) return;
  const reg = new RegExp(`${tokenIdxName}: (.*)`);

  const curSize = styleSheet.innerText.match(reg)?.[1]?.split?.(";")?.[0];
  if (!curSize) {
    console.warn(`CSS variable: ${tokenIdxName} is not exist`);
    return;
  }
  styleSheet.innerText = styleSheet.innerText.replace(
    `${tokenIdxName}: ${curSize}`,
    `${tokenIdxName}: ${res}`
  );
}

// get current stylesheet
export function getCustomThemeSheet() {
  const styleSheet = document.getElementById(customTheme);

  return styleSheet;
}

// transform percentage string to float string
export function replacePercentages(str) {
  return str.replace(/(\d+(\.\d+)?)%/g, (match, number) => {
    return `${parseFloat(number) / 100}`;
  });
}
