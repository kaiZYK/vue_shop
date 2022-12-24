const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "./",
  chainWebpack: (config) => {
    // 判断是生产环境打包main-prod.js
    config.when(process.env.NODE_ENV === "production", (config) => {
      config.entry("app").clear().add("@/main-prod.js");

      // // 生产环境加载外部CDN资源
      // config.set("externals", {
      //   vue: "Vue",
      //   axios: "axios",
      //   echarts: "echarts",
      //   "vue-quill-editor": "VueQuillEditor",
      //   lodash: "_",
      // });
    });
    // 判断是开发环境打包main-dev.js
    config.when(process.env.NODE_ENV === "development", (config) => {
      config.entry("app").clear().add("@/main-dev.js");
    });
  },
});
