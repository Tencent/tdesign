import mdToVue from './md-to-vue.js';

export default {
  render({ source, file, md }) {
    const sfc = mdToVue({ md, file, source });

    return sfc;
  },
};
