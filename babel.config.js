// 创建生产环境中的plugins数组
let prodPlugins = [];
// 判断当前环境是否为生产环境 如果是生产环境把transform-remove-console放入数组中
if (process.env.NODE_ENC === "production") {
  prodPlugins.push("transform-remove-console");
}

module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    // 生产环境下plugins 扩展运算符把数组展开
    ...prodPlugins,
  ],
};
