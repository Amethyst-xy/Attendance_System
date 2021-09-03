import axios from "axios";
import { message } from "antd";
import Qs from "qs";

export default function ajax(url, data={}, type='GET') {
    return new Promise((resolve, reject) => {
      let promise;

      // 1. 执行异步ajax请求
      if(type==='GET') { // 发GET请求
        promise = axios.get(url, { // 配置对象
          params: data // 指定请求参数
        })
      } else { // 发POST请求
        promise = axios.post(url, Qs.stringify(data));
      }
      // 2. 如果成功了, 调用resolve(value)
      promise.then(response => {
        resolve(response.data)
      // 3. 如果失败了, 不调用reject(reason), 而是提示异常信息
      }).catch(error => {

        if (error.response.status === 504 || error.response.status === 404) {
          message.error( '服务器被吃了( ╯□╰ )')
        } else if (error.response.status === 403) {
          message.error('权限不足，请联系管理员')
        } else if (error.response.status === 401) {
          message.error(error.response.data.msg ? error.response.data.msg : '尚未登录，请登录')
        } else {
          if (error.response.data.msg) {
            message.error( error.response.data.msg)
          } else {
            message.error( '请求出错了: ' + error.message)
          }
        }
      })
    })
  }



  