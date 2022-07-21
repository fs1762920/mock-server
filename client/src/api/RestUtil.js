import axios from 'axios';
import qs from 'qs'

const baseUrl = 'http://localhost:8080'

axios.defaults.timeout = 30000
// 请求拦截器
axios.interceptors.request.use(
  config => {
    if (config.method === 'get') {
      // 如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
      config.paramsSerializer = function(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }
    return config;
  },
 
  error => {
   // 对请求错误做些什么
    return Promise.reject(error);
  }
)

 
//GET请求
export const $get = function (url, params) {
  return new Promise((resolve, reject) => {
    axios({
      async: false,
      method: 'get',//请求方式
      url: url,         //请求url
      params,      //请求参数
      baseURL: baseUrl //基础地址,将自动加在 `url` 前面
    }).then(res => {
      resolve(res.data)
    }).catch(error => {
      reject(error)
    })
  })
}
 
//POST请求
export const $post = function (url, param) {
  return new Promise((resolve, reject) => {
    axios({
      async: false,
      method: 'post',
      url: url,
      data: param ? param : "", //数据体
      baseURL: baseUrl
    }).then(res => {
      resolve(res.data)
    }).catch(error => {
      reject(error)
    })
  })
}