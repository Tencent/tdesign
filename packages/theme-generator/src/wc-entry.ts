import { defineCustomElement } from 'vue';

import tdesignCss from './styles/tdesign.min.css?inline';
import resetCss from './styles/reset.min.css?inline';

import generatorVars from './styles/generator-vars.css?inline';

import Generator from './generator.vue';

const TDThemeGenerator = defineCustomElement(Generator, {
  shadowRoot: true,
  styles: [tdesignCss, resetCss, generatorVars],
});

customElements.define('td-theme-generator', TDThemeGenerator);

export default TDThemeGenerator;
