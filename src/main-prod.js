import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 引入全局css样式
import "@/assets/css/global.css";

// 引入iconFont字体图标
import "@/assets/fonts/iconfont.css";

// 引入axios
import axios from "@/axios/index.js";
Vue.prototype.$http = axios;

// 引入element UI
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

// 引入vue-table-with-tree-grid表格框架
import TreeTable from "vue-table-with-tree-grid";
Vue.component("tree-table", TreeTable);

// 引入富文本编辑器
import VueQuillEditor from "vue-quill-editor";
// 引入富文本编辑器的样式
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
Vue.use(VueQuillEditor);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
