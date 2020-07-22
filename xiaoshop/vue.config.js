console.log(process.env.FOO);
module.exports = {
  outputDir: "dist", //build输出目录
  assetsDir: "assets", //静态资源目录（js, css, img）
  lintOnSave: false, //是否开启eslint
  devServer: {
    open: true, //是否自动弹出浏览器页面
    host: "localhost",
    port: "8081",
    https: false, //是否使用https协议
    hotOnly: false, //是否开启热更新
    // proxy: null
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        ws: true,
        changeOrigin: true,
        pathRewrite: {//???
          "^/api": "",
        },
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        vue$: "vue/dist/vue.esm.js",
      },
    },
  },
};
