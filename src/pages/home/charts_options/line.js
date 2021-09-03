import React,{useEffect,useState} from "react";
import ReactECharts from 'echarts-for-react';
import {getIP, reqDayData} from "../../../api";
import storageUtils from "../../../utils/storageUtils";

const getOption=(grade,series)=>{
    const option = {
        title: {
            text: grade?'2020级':'2021级'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
            type: 'value'
        },
        series
    };

    return option;
}





export default function Line(props){
    const {grade}=props;
    const [series, setseries] = useState([]);

    const getData=async (grade)=>{
        const res=await reqDayData(grade);
        if(res.status===0){
            const userdata=res.data;
            const arr=[];
            for(let i in userdata){
                const obj=userdata[i].day;
                const data=[];
                for(let j in obj){
                    data.push(obj[j]);
                }
                arr.push({
                    name:userdata[i].nickname,
                    type:'line',
                    stack:'时长',
                    data
                });
            }
            setseries(arr);
        }
    }

    useEffect(()=>{
        getData(grade);
    },[grade]);

    return <ReactECharts option={getOption(grade,series)}/>
}



