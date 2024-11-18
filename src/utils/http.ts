import axios from 'axios';
import type  { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig }  from 'axios';

const http: AxiosInstance =  axios.create({
    baseURL: 'http://39.105.176.197:8888',
    timeout: 60000,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });

  http.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

http.interceptors.response.use(
    (response:AxiosResponse) => {
        if (response.status === 200) {
            return response;
        } else {
            Promise.reject();
        }
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

export default http;