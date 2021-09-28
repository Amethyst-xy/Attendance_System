import React,{Component} from 'react';
import {Card, Button, Table, Progress, message, Modal, notification} from "antd";
import {getUsers, reqStartClock, reqEndClock, reqChangeOnline} from "../../api";
import storageUtils from '../../utils/storageUtils';
import {Redirect} from "react-router-dom";
  

class Detail extends Component{
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
                title: '状态',
                align:'center',
                dataIndex:'online',
                render:online=>{
                    return online===1?(
                        <span style={{color:"#7546C9"}}
                    >正在打卡</span>):'未打卡'
                }
            },
            {
              title: '总时长(h)',
              dataIndex: 'allTime',
              align:'center',
              render:alltime=>alltime?alltime:this.allTime
            },
            {
                title: '已完成(h)',
                dataIndex: 'finishTime',
                align:'center',
                render:finish=>finish?finish:0
            },
            {
                title: '完成情况(%)',
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

    //分年级获取所有用户
    initUsers=async ()=>{
        this.setState({isloading:true});
        const data=await getUsers(this.grade);

        if(data.status===0){
            const list=data.data;
            list.sort((a,b)=>b.finishTime-a.finishTime);

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
            this.setState({list,isloading:false});
        }
        this.setState({isloading:false});
    }

    //开始打卡
    startClock=async ()=>{
        this.setState({clockLoading:true});

        const {username}=storageUtils.getUser();
        const res=await reqStartClock(username);

        if (res){
            this.setState({clockLoading: false});
            if (res.status === 0) {
                message.success('打卡成功');
                //将storage中的状态改为true
                this.initUsers();
            }  else if (res.status === 3) {
                this.openNotification();
            } else if (res.status === 2) {
                message.error(res.msg);
            }
        }
    }

    //结束打卡
    endClock=async ()=>{
        this.setState({clockLoading:true});

        const {username}=storageUtils.getUser();
        const res=await reqEndClock(username);

        if (res){
            this.setState({clockLoading: false});
            if (res.status === 0) {
                message.success('下卡成功');
                await this.initUsers();
            } else if (res.status === 2) {
                message.error(res.msg);
            } else if (res.status === 3) {
                this.openNotification();
            } else {
                Modal.confirm({
                    content: res.msg + ',确定要结束吗？',
                    onOk: async () => {
                        storageUtils.addStatus(false);
                        await reqChangeOnline(username);
                        await this.initUsers();
                    }
                })
            }
        }
    }

    UNSAFE_componentWillMount(){
        this.initTable();
        this.setState({isonline:storageUtils.getUser().online});
    }

    componentDidMount(){
        this.initUsers();
    }


    close = () => {
        window.open('chrome://flags/');
    };

    openNotification = () => {
        const key = `open${Date.now()}`;
        const btn = (
            <Button type="primary" size="small" onClick={() => notification.close(key)}>
                Confirm
            </Button>
        );
        notification.open({
            message: '浏览器权限设置',
            description:
                '1.请使用谷歌浏览器PC端打卡 \n ' +
                '2.打开地址chrome://flags/ \n ' +
                '3.搜索 #enable-webrtc-hide-local-ips-with-mdns 该配置 并将属性改为disabled',
            btn,
            key,
            onClose: this.close(),
        });
    };



    render(){
        const {list,isloading,isonline ,clockLoading}=this.state;
        const title=(
            <Button type='primary' onClick={()=>{this.initUsers()}}>刷新</Button>
        );
        const extra=isonline?(
            isonline===1?<Button loading={clockLoading} style={{backgroundColor:"#7546C8",color:"#fff"}} onClick={this.endClock}>结束打卡</Button>:''
        ):(
            <Button loading={clockLoading} style={{backgroundColor:"#7546C8",color:"#fff"}} onClick={this.startClock}>开始打卡</Button>
        )

        return (
            <Card title={title} extra={extra}>
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

export default Detail;