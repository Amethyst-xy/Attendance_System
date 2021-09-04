import React,{useState,useEffect} from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import {List,Card } from 'antd';
import './index.less';
import storageUtils from '../../utils/storageUtils';
import {reqDetailInfo} from '../../api';
import {BASE_SRC} from '../../utils/constants';
import src from '../../assets/images/1.png';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2730560_lqh5cka8vsi.securityJs',
});


export default function SelfInfo(props){
    const [user, setuser] = useState({});

    const getDetail=async ()=>{
        const {username}=storageUtils.getUser();
        const res=await reqDetailInfo(username);
        if(res.status===0){
            setuser(res.data);
        }
    }

    useEffect(()=>{
        getDetail();
    },[]);

    const {nickname,username,grade,avatar}=user;

    return (
        <div>
            <div className='header'>
                <img src={user.avatar?(user.avatar):src} alt='avatar'></img>
                <p className='header_right'>
                    <span className='nickname'>{nickname}</span>
                    <span className='modify' onClick={()=>{props.history.push('/detail/update',user)}}>
                        修改信息
                        <IconFont type='icon-xiugai-copy'/>
                    </span>
                </p>
            </div>
            <Card title='详细信息'>
                <List
                        size="small"
                    >
                        <List.Item>
                            <p className='detail_title'>
                                用户名：
                                <span>{username}</span>    
                            </p>
                        </List.Item>
                        <List.Item>
                            <p className='detail_title'>
                                真实姓名：
                                <span>{nickname}</span>    
                            </p>
                        </List.Item>
                        <List.Item>
                            <p className='detail_title'>
                                年级：
                                <span>{grade?'2020级':'2021级'}</span>    
                            </p>
                        </List.Item>
                        {/* <List.Item>
                            <p className='detail_title'>
                                打卡进度：
                                <Progress
                                    type="circle"
                                    strokeColor={{
                                        '0%': '#108ee9',
                                        '100%': '#87d068',
                                    }}
                                    percent={100}
                                /> 
                            </p>
                        </List.Item> */}
                    </List>  
            </Card>
        </div>
    );
} 