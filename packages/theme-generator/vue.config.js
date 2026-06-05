const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    allowedHosts: 'all',
  },
  chainWebpack: (config) => {
    config.module
      .rule('raw')
      .test(/\?raw$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end();
    config.resolve.extensions.add('.vue');
  },
});
