import { defineCustomElement } from 'vue';
import GeneratorCe from './Generator.ce.vue';

const ThemeGeneratorElement = defineCustomElement(GeneratorCe);

customElements.define('td-theme-generator', ThemeGeneratorElement);
