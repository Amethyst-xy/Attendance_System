import React,{Component} from 'react';
import {Card, Button, Table, Progress, message, Modal, notification} from "antd";
import {getUsers, reqStartClock, reqEndClock, reqChangeOnline, reqIncomplete} from "../../api";
import storageUtils from '../../utils/storageUtils';
import {Redirect} from "react-router-dom";


class Incomplete extends Component{
    constructor(props){
        super(props);
        this.grade=this.props.grade;//年级
        this.allTime=this.grade?38:28;//默认总时长
        this.state={
            list:[],
            isloading:false,
            isonline:true,
            clockLoading: false
        }
    }

    //初始化表格
    initTable=()=>{
        this.columns= [
            {
                title: '序号',
                align:'center',
                render:(value)=>{
                    const list=this.state.list;
                    for(let i in list){
                        if(list[i].username===value.username){
                            return i;
                        }
                    }
                }
            },
            {
                title: '姓名',
                dataIndex: 'nickname',
                align:'center'
            },
            {
                title:'年级',
                dataIndex:'grade',
                align:'center',
                render:grade=> {
                    if (grade === 0) {
                        return  '大一';
                    } else if (grade === 1) {
                        return  '大二';
                    } else {
                        return  '其他年级';
                    }
                }
            },
            {
                title: '累计未完成(周)',
                dataIndex: 'incomplete',
                align:'center'
            },
            {
                title: '连续未完成(周)',
                dataIndex: 'consecutive',
                align:'center'
            },
            {
                title: '总时长(h)',
                dataIndex: 'allTime',
                align:'center',
                render:alltime=>alltime?alltime:this.allTime
            },
            {
                title: '上周已完成(h)',
                dataIndex: 'finishTime',
                align:'center',
                render:finish=>finish?finish:0
            },
            {
                title: '上周完成情况(%)',
                align:'center',
                render:(data)=>{
                    let {online,allTime,finishTime}=data;
                    allTime=allTime?allTime:this.allTime;
                    finishTime=finishTime?finishTime:0;

                    const percent=parseFloat(finishTime*100/allTime).toFixed(2);
                    return (
                        <Progress
                            percent={percent}
                            status={percent>=100||!online?'':'active'}
                            strokeColor={{
                                from: '#108ee9',
                                to: '#87d068'
                            }}
                        />
                    )
                }
            }
        ];
    }

    //获取未完成打卡成员列表
    initUsers=async ()=>{
        this.setState({isloading:true});
        const data=await reqIncomplete();

        if(data.status===0){
            const list=data.data;
            list.sort((a,b)=>b.finishTime-a.finishTime);

            this.setState({list,isloading:false});

            //查找到当前登录用户，同步打卡状态
            const cur=list.find(item=>item.username===storageUtils.getUser().username);
            if(cur){
                this.setState({isonline:cur.online});
                const user=storageUtils.getUser();
                user.online=cur.online;
                storageUtils.addUser(user);
            }else{
                this.setState({isonline:2});
            }
            // this.setState({list,isloading:false});
        }
        this.setState({isloading:false});
    }



    UNSAFE_componentWillMount(){
        this.initTable();
        this.setState({isonline:storageUtils.getUser().online});
    }

    componentDidMount(){
        this.initUsers();
    }





    render(){
        const {list,isloading}=this.state;
        const title=(
            <Button type='primary' onClick={()=>{this.initUsers()}}>刷新</Button>
        );

        return (
            <Card title={title}>
                <Table
                    loading={isloading}
                    dataSource={list}
                    columns={this.columns}
                    bordered
                    rowKey='username'
                    pagination={{
                        pageSize:8,
                        showQuickJumper:true
                    }}
                />
            </Card>
        );
    }
}

export default Incomplete;