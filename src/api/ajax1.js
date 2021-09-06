import axios from "axios";
import { message } from "antd";
import Qs from "qs";
import getUserIP from "./getUserIP";
import md5 from "js-md5"
import {Redirect} from "react-router-dom";
import React from "react";
import {reqLogout} from "./index";
import storageUtils from "../utils/storageUtils";


export default function ajax1(url, data={}) {


    return new Promise((resolve, reject) => {
        let promise;

        // 发POST请求

                getUserIP().then(value => {
                    let md5Ip = 'offRTC';

                    //加密
                    if (value!== undefined && value.length <= 15 ) {
                        value = value.substr(0, 10);
                        var minutes = new Date().getMinutes();
                        var concatIp = value+minutes;
                        md5Ip = md5(concatIp);

                    }

                    promise = axios.post(url, Qs.stringify(data), {
                        headers : {"LOCAL-IP":md5Ip},
                    });
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
                            message.error( '尚未登录，请登录');
                            reqLogout().then(resp=>{
                                storageUtils.removeUser();
                                window.location.reload();
                            })
                        } else {
                            if (error.response.data.msg) {
                                message.error( error.response.data.msg)
                            } else {
                                message.error( '请求出错了: ' + error.message)
                            }
                        }
                    })
                })



    })
}



