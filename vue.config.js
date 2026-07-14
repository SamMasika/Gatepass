const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? './' : './',

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    }
  },

  // === TEMPORARY FIX FOR BUILD ERROR ===
  css: {
    extract: true
  },

  chainWebpack: config => {
    // Disable CSS minification temporarily to see the real error
    config.optimization.minimizer('css').tap(args => {
      if (args[0]) {
        args[0].options.minify = false
      }
      return args
    })
  }
})