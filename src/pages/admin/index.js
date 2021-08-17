import React,{useEffect} from 'react';
import { Layout,Modal } from 'antd';
import LinkButton from '../../components/link_button/link_button';
import { Switch,Route, Redirect } from "react-router-dom";
import Home from "../home";
import Freshman from "../attendance/freshman";
import Sophomore from "../attendance/sophomore";
import Personal from "../personal";
import User from "../user";
import Detail from '../detail';
import UpdateForm from "../detail/update";
import NotFound from "../not_found";
import storageUtils from '../../utils/storageUtils';
import LeftNav from './leftNav';
import menuConfig from "../../config/menuConfig";
import {reqCleanInfo, reqDetailInfo} from '../../api';
import url from '../../assets/images/1.png';
import {BASE_SRC} from '../../utils/constants';

import './index.less';

const { Header, Footer, Sider, Content } = Layout;


export default function Admin(props){
    let user=storageUtils.getUser();
    let clean={};

    const getClean_Detail=async ()=>{
        const res=await Promise.all([reqCleanInfo(),reqDetailInfo(storageUtils.getUser().nickname||'admin')]);
        if(res[0].status===0){
            clean=res[0].data;
        }
        if(res[1].status===0){
            user=res[1].data;
        }
    }

    useEffect(()=>{
        getClean_Detail();
    });

    //获取title
    const getTitle=()=>{
        let title;
        const path=props.location.pathname;
        menuConfig.forEach(item=>{
            if(!item.children){
                if(path.indexOf(item.key)!==-1){
                    title=item.title;
                }
            }else{
                const child=item.children.find(i=>path.indexOf(i.key)!==-1);
                if(child){
                    title=child.title;
                }
            }
        })
        return title;
    }

    //退出登录
    const logOut=()=>{
        Modal.confirm({
            content: '确认退出吗？',
            okText:'确定',
            cancelText:'取消',
            onOk:()=>{
                //清除缓存数据
                storageUtils.removeUser();
                props.history.replace('/login');
            }
        });
    }

    if(!user.nickname){
        return <Redirect to='/login'></Redirect>
    }


    return (
        <Layout style={{minHeight:"100%"}}>
            <Sider className='sider'>
                <div className='sider_header'>
                    <div className='avatar'>
                        <img src={user.avatar?BASE_SRC+user.avatar:url} alt='avatar'></img>
                    </div>
                    <p className='username'>{user.nickname}</p>
                </div>      
                <LeftNav/>     
            </Sider>
            <Layout>
                <Header style={{backgroundColor:"#fff",padding:0}}>
                    <div className='top'>
                        Hi~{storageUtils.getUser().nickname}
                        <LinkButton onClick={logOut}>退出</LinkButton>
                    </div>
                    <div className='bottom'>
                        <div className='bottom_left'>{getTitle()}</div>
                        <div className='bottom_right'>当前是第{clean.day+1}周，卫生:{clean.username}</div>
                    </div>
                </Header>
                <Content style={{backgroundColor:"#fff",margin:"20px",marginBottom:0}}>
                    <Switch>
                        <Redirect exact from='/' to='/home'></Redirect>
                        <Route  path='/home' component={Home}></Route>
                        <Route  path='/attendance/freshman' component={Freshman}></Route>
                        <Route  path='/attendance/sophomore' component={Sophomore}></Route>
                        <Route  path='/user' component={User}></Route>
                        <Route exact path='/detail' component={Detail}></Route>
                        <Route path='/detail/update' component={UpdateForm}></Route>
                        <Route  path='/charts' component={Personal}></Route>
                        <Route component={NotFound}></Route>
                    </Switch>
                </Content>
                <Footer style={{textAlign:"center",lineHeight:""}}>
                    Copyright © 2021 - 2022 LeCheng. All Rights Reserved. 乐程软件工作室 版权所有
                </Footer>
            </Layout>
        </Layout>
    );
}