import mdToVue from './md-to-vue';

export default {
  render({ source, file, md }) {
    return mdToVue({ md, file, source });
  },
};
