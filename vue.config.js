module.exports = {
  transpileDependencies: [
    'vuetify'
  ],

  devServer: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_REMOTE_SERVER_HOST_IP + '/api',
        ws: true,
        pathRewrite: {'^/api': ''},
        changeOrigin: true,
        secure: true
      },
    }
  }

}
