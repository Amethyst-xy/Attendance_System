import React from 'react';
import { Layout } from 'antd';
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
import HeaderPart from './header';
import './index.less';
import Others from "../attendance/others";
import Incomplete from "../attendance/incomplete";
import Official from "../Official";


const {Footer, Content } = Layout;

export default function Admin(){
    const user=storageUtils.getUser();

    if(!user.username){
        return <Redirect to='/login'/>
    }

    return (
        <Layout style={{minHeight:"100%"}}>
            {user.username&&<LeftNav/>}  
            <Layout>
                {user.username&&<HeaderPart/>}
                <Content style={{backgroundColor:"#fff",margin:"20px",marginBottom:0}}>
                    <Switch>
                        <Redirect exact from='/' to='/home'/>
                        <Route  path='/home' component={Home}/>
                        <Route  path='/freshman' component={Freshman}/>
                        <Route  path='/sophomore' component={Sophomore}/>
                        <Route  path='/others' component={Others}/>
                        <Route  path='/incomplete' component={Incomplete}/>
                        <Route  path='/userinfo' component={User}/>
                        <Route exact path='/detail' component={Detail}/>
                        <Route path='/detail/update' component={UpdateForm}/>
                        <Route  path='/charts' component={Personal}/>
                        <Route  path='/official' component={Official}/>
                        <Route component={NotFound}/>
                    </Switch>
                </Content>
                <Footer style={{textAlign:"center",lineHeight:""}}>
                    Copyright ?? 2021 - 2022 LeCheng. All Rights Reserved. ????????????????????? ????????????
                </Footer>
            </Layout>
        </Layout>
    );
}