import axios from 'axios';

const http = axios.create({
  baseURL: 'http://39.105.176.197:8888',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

// 请求拦截器
http.interceptors.request.use(config => {
  // 例如，添加Token
  return config;
}, error => {
  return Promise.reject(error);
});

// 响应拦截器
http.interceptors.response.use(response => {
  // 处理响应数据
  return response;
}, error => {
  // 处理响应错误
  return Promise.reject(error);
});

export default http;
