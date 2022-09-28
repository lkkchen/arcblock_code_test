import axios from 'axios';
import {message} from "antd"

axios.interceptors.request.use(
  (config) => {
    const prefix = window.blocklet ? window.blocklet.prefix : '/api';
    config.baseURL = prefix || '';
    config.timeout = 200000;

    return config;
  },
  (error) => Promise.reject(error)
);

function request ({method, url, data}, callback, errorCallback) {
  const jwtToken = window.localStorage.getItem("token");
  const option = {
    url,
    method,
    data,
    params: {},
    headers: {
      'x-jwt-token': jwtToken
    },
  };
  if (method.toLowerCase() === 'get') {
    option.params = data;
    option.data = {};
  }

  axios(option).then((resData) => {
    if(resData.status !== 200){
      return errorCallback();
    }

    if(resData.data.code !== 0){
      message.error(resData.data.msg);
      return errorCallback(resData.data.msg);
    }

    if(resData.data.msg){
      message.success(resData.data.msg);
    }
    callback(resData.data.data);
  }).catch((error) => {
    errorCallback(error);
  });

}

export default request;
