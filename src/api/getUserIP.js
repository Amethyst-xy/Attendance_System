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
                let ip2;
                rtc.onicecandidate = (evt) => {
                    //监听candidate事件
                    if (evt.candidate) {
                        ip = evt.candidate.address;
                        resolve(ip);
                    }
                };

            })();
        else {
            console.log("目前仅测试了chrome浏览器OK");
        }
    })

}


// export  function getUserIP1() {
//     let ip;
//     var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
//     if (RTCPeerConnection) (function () {
//         var rtc = new RTCPeerConnection({iceServers:[]});
//         if (1 || window.mozRTCPeerConnection) {
//             rtc.createDataChannel('', {reliable:false});
//         };
//
//         rtc.onicecandidate = function (evt) {
//             if (evt.candidate) grepSDP("a="+evt.candidate.candidate);
//         };
//         rtc.createOffer(function (offerDesc) {
//             grepSDP(offerDesc.sdp);
//             rtc.setLocalDescription(offerDesc);
//         }, function (e) { console.warn("offer failed", e); });
//
//
//         var addrs = Object.create(null);
//         addrs["0.0.0.0"] = false;
//         function updateDisplay(newAddr) {
//             if (newAddr in addrs) return;
//             else addrs[newAddr] = true;
//             var displayAddrs = Object.keys(addrs).filter(function (k) { return addrs[k]; });
//             for(var i = 0; i < displayAddrs.length; i++){
//                 if(displayAddrs[i].length > 16){
//                     displayAddrs.splice(i, 1);
//                     i--;
//                 }
//             }
//             console.log(displayAddrs[0]);      //打印出内网ip
//         }
//
//
//
//         function grepSDP(sdp) {
//             var hosts = [];
//             sdp.split('\r\n').forEach(function (line, index, arr) {
//                 if (~line.indexOf("a=candidate")) {
//                     var parts = line.split(' '),
//                         addr = parts[4],
//                         type = parts[7];
//                     if (type === 'host') updateDisplay(addr);
//                 } else if (~line.indexOf("c=")) {
//                     var parts = line.split(' '),
//                         addr = parts[2];
//                     updateDisplay(addr);
//                 }
//             });
//         }
//     })();
//     else{
//         console.log("请使用主流浏览器：chrome,firefox,opera,safari");
//     }
//     return ip;
//
// }