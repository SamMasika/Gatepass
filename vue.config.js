const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? './' : './',

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    }
  },

  // === TEMPORARY FIX: Disable CSS minification ===
  css: {
    extract: true
  },

  chainWebpack: (config) => {
    // Safer way to disable CSS minimizer
    config.optimization.minimize(false)
  }
})