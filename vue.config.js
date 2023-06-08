const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/pf-card-generator/',

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  },
  pages: {
    index: {
      // entry for the page
      entry: 'src/main.js',
      title: 'PF2E: Генератор карт',
    },
  }
})
