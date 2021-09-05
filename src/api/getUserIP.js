import storageUtils from "../utils/storageUtils";
import React,{useState} from 'react';



export  default function getUserIP () {
    return new Promise((resolve,reject)=>{
        let ip;
        var RTCPeerConnection =
            window.RTCPeerConnection ||
            window.webkitRTCPeerConnection ||
            window.mozRTCPeerConnection;
        if (RTCPeerConnection)
            (() => {
                var rtc = new RTCPeerConnection();
                rtc.createDataChannel(""); //创建一个可以发送任意数据的数据通道
                rtc.createOffer(
                    (offerDesc) => {
//创建并存储一个sdp数据
                        rtc.setLocalDescription(offerDesc);
                    },
                    (e) => {
                         console.log(e);
                    }
                );
                rtc.onicecandidate = (evt) => {
                    //监听candidate事件
                    if (evt.candidate) {
                        ip = evt.candidate.address;
                        resolve(ip);
                        console.log(ip);
                    }
                };

            })();
        else {
            console.log("目前仅测试了chrome浏览器OK");
        }
    })

}

