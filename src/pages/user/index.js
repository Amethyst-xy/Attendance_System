import React, {useState,useRef,useEffect} from 'react';
import { Card,Table,Button,Progress,Modal, message } from "antd";
import LinkButton from '../../components/link_button/link_button';
import ModifyForm from "./modify_form";
import { getUsers, reqDeleteUser, reqStartClock, reqUpdateUser,reqEndClock } from "../../api";
// import storageUtils from '../../utils/storageUtils';

export default function User(props){
    let columns=[],willmount=true;
    const [isloading, setisloading] = useState(true);
    const [list, setlist] = useState([]);//所有用户数据
    const [user, setuser] = useState({});//修改用户
    const [isModalVisible, setIsModalVisible] = useState(false);//控制Modal显示与隐藏
    const formRef = useRef();

    const initUsers=async ()=>{
        setisloading(true);
        let arr=[];
        const res=await Promise.all([getUsers(0),getUsers(1)]);
        if(res[0].status===0){
            arr=res[0].data;
        }
        if(res[1].status===0){
            arr=[...arr,...res[1].data];
        }
        
        arr.sort((a,b)=>b.finishTime-a.finishTime);
        setlist(arr);
        setisloading(false);
    }

    useEffect(()=>{
        initUsers();
    },[]);

    //删除用户
    const deleteUser=(user)=>{
        const {nickname,username}=user;
        Modal.confirm({
            content: '确定要删除'+username+'吗?',
            okText:'确定',
            cancelText:'取消',
            onOk:async ()=>{
                const res=await reqDeleteUser(nickname);
                if(res.status===0){
                    message.success('删除成功');
                    initUsers();
                }else{
                    message.err('删除失败');
                }
            }
        });
    }

    //初始化表格
    const initTable=()=>{
        const columns = [
            {
                title: '序号',
                align:'center',
                render:value=>{
                    for(var i in list){
                        if(list[i].nickname===value.nickname){
                            return i;
                        }
                    }
                }
            },
            {
                title: '姓名',
                dataIndex: 'username',
                align:'center'
            },
            {
                title:'用户名',
                dataIndex:'nickname',
                align:'center'
            },
            {
                title:'年级',
                dataIndex:'grade',
                align:'center',
                render:grade=>grade?'大二':'大一'
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
              align:'center',
              render:values=>{
                  const {allTime,grade}=values;
                  if(!allTime){
                      return grade?38:28;
                  }else{
                      return allTime;
                  }
              }
            },
            {
                title: '已完成(h)',
                dataIndex: 'finishTime',
                align:'center',
                render:finishtime=>finishtime?finishtime:0
            },
            {
                title: '完成情况(%)',
                align:'center',
                render:(data)=>{
                let {online,allTime,finishTime,grade}=data;
                    if(!allTime){
                        allTime=grade?38:28;
                    }
                    if(!finishTime){
                        finishTime=0;
                    }
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
            },
            {
                title: '操作',
                align:'center',
                render:(user)=>{
                    return (
                        <div>
                            <LinkButton onClick={()=>{setuser(user);setIsModalVisible(true)}}>修改</LinkButton>
                            <LinkButton onClick={()=>{deleteUser(user)}}>删除</LinkButton>
                        </div>
                    );
                }
            },
        ];
        return columns;
    }
    
    if(willmount){
        willmount=false;
        columns=initTable();
    }

    const handleOk =async () => {
        const values=await formRef.current.formRef.validateFields().catch(err=>console.log(err));
        values.online=values.online==='正在打卡'?1:0;
        const params={...values,nickname:user.nickname,role:'member'};
        
        const res=await reqUpdateUser(params);
        if(res.status===0){
            setIsModalVisible(false);

            // const user=storageUtils.getUser();
            // if(user.nickname===params.nickname){
            //     //修改的是管理员自己的用户名—>跳转登录
            //     props.history.replace('/login');
            //     message.warning('【用户名更改】重新登录');
            // }
            
            if(res.data===1){
                //请求下卡
                const response=await reqEndClock(params.nickname);
                if(response.status!==0){
                    message.warning(response.msg);
                }
            }else if(res.data===2){
                //请求打卡
                const response=await reqStartClock(params.nickname);
                if(response.status!==0){ 
                    message.warning(response.msg);
                }   
            }
            message.success('修改成功');
            initUsers();
        }else{
            message.error('修改失败');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const extra=(
        <Button 
            style={{backgroundColor:'#7546C8',color:'#fff'}}
            onClick={()=>{initUsers()}}
        >刷新</Button>
    );
    return (
        <div>
            <Card title='用户数据' extra={extra}>
                <Table
                    loading={isloading}
                    dataSource={list}
                    columns={columns}
                    rowKey='nickname'
                    pagination={{
                        pageSize:10,
                        showQuickJumper:true
                    }}
                >
                </Table>
            </Card>
            <Modal title="修改用户" 
                visible={isModalVisible} 
                onOk={handleOk} 
                onCancel={handleCancel}
            >
                <ModifyForm ref={formRef} user={user}/>
        </Modal>
        </div>
    );
}