const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: ['vuetify'], //  must be an array, not true

  publicPath: process.env.NODE_ENV === 'production' ? './' : './',

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },

  configureWebpack: {
    resolve: {
      fallback: {
        https: require.resolve('https-browserify'),
        stream: require.resolve('stream-browserify'),
        process: require.resolve('process/browser'),
      },
    },
  },

  devServer: {
    historyApiFallback: true,
    hot: true,
  }
})
