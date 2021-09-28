import React,{useEffect,useState} from "react";
import ReactECharts from 'echarts-for-react';
import {reqWeekData} from '../../../api';

const getOption=(grade,data)=>{
    const option = {
        backgroundColor: '#2c343c',
    
        title: {
            text: grade?'2020级':'2021级',
            left: 'center',
            top: 20,
            textStyle: {
                color: '#ccc'
            }
        },

        grid:{
            height:'auto'
        },
    
        tooltip: {
            trigger: 'item'
        },
    
        visualMap: {
            show: false,
            min: 0,
            max: 80,
            inRange: {
                colorLightness: [0.3, 1]
            }
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: data.sort(function (a, b) { return a.value - b.value; }),
                roseType: 'radius',
                label: {
                    color: 'rgba(255, 255, 255, 0.3)'
                },
                labelLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                },
                itemStyle: {
                    color: grade?'#7546c8':'',
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
    
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                }
            }
        ]
    };

    return option;
}

export default function Pie(props){
    const {grade}=props;
    const [data, setdata] = useState([]);

    const getWeekData=async (grade)=>{
        const res=await reqWeekData(grade);
        if(res.status===0){
            const arr=[];
            const userdata=res.data;

            for(var i in userdata){
                arr.push({value:userdata[i].allTime,name:userdata[i].nickname});
            }
            setdata(arr);
        }
    }

    useEffect(()=>{
        getWeekData(grade);
    },[grade]);

    return <ReactECharts option={getOption(grade,data)}/>
}