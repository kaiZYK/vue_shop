import axios from "axios";

// 引入NProgress进度条
import NProgress from "nprogress";
import "nprogress/nprogress.css";

let http = axios.create({
  baseURL: "http://127.0.0.1:8888/api/private/v1/",
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 设置请求头
    config.headers["Authorization"] = window.sessionStorage.getItem("token");
    // 请求时进度条开始
    NProgress.start();
    return config;
  },
  (error) => {
    return error;
  }
);

// 响应拦截器
http.interceptors.response.use(
  (config) => {
    // 响应时进度条结束
    NProgress.done();
    return config;
  },
  (error) => {
    return error;
  }
);

export default http;
