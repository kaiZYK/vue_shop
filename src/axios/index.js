import axios from "axios";
let http = axios.create({
  baseURL: "http://127.0.0.1:8888/api/private/v1/",
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 设置请求头
    config.headers[token] = window.sessionStorage.getItem("token");
    return config;
  },
  (error) => {
    return error;
  }
);

// 响应拦截器
http.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return error;
  }
);

export default http;
