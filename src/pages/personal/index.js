import React,{Component} from 'react';
import {Card} from 'antd';
import ReactECharts from 'echarts-for-react';
import { reqWeekData,reqDayData } from "../../api";
import storageUtils from '../../utils/storageUtils';


class Personal extends Component{
    constructor(props){
        super(props);
        this.state={
            day_data:[],
            week_data:[]
        }
    }

    getOptions_week=(data)=>{
        return {
            color:'#7546C8',
            tooltip: {
                trigger: 'axis'
            },    
            xAxis: { 
                type: 'category',
                data: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周','第7周','第8周','第9周','第10周','第11周','第12周','第13周','第14周']
            },
            yAxis: {
                type: 'value',
                name:'总时长/h'
            },
            dataZoom:{
                type:'slider',
                xAxisIndex:0,
                disabled:false,
        
            },
            series: [{
                data,
                type: 'bar'
            }]
        };
    }

    getOptions_day=(data)=>{
        return {
            color:'#7546C8',
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: {
                name:'打卡时长/h',
                type: 'value'
            },
            series: [{
                data,
                type: 'line'
            }]
        };
    }


    //获取每周/每天的数据
    getData=async (isweek)=>{
        const username=storageUtils.getUser().username;
        let res;
        if(isweek){
            res=await reqWeekData(2);
        }else{
            res=await reqDayData(2);
        }
        const arr=res.data;
        for(let i in arr){
            if(arr[i].username===username){
                const obj=arr[i].day;
                const array=[]; 
                for(let i in obj){
                    array.push(obj[i]);
                }
                if(isweek){
                    this.setState({week_data:array});
                }else{
                    this.setState({day_data:array});
                }
            }
        }
    }

    

    componentDidMount(){
        //获取每周
        this.getData(true);
        // //获取每天
        this.getData(false);
    }

    render(){
        const {week_data,day_data}=this.state;
        return (
            <div>
                <Card title='本周数据'>
                    <ReactECharts option={this.getOptions_day(day_data)}/>
                </Card>
                <Card title='历史数据'>
                    <ReactECharts option={this.getOptions_week(week_data)}/>
                </Card>
                {/* <Chart/> */}
            </div>
        );
    }
}

export default Personal;