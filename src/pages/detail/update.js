import React,{ useRef} from "react";
import { Card,Form, Input,Select,Button,message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import PicturesWall from "./picture_wall";
import LinkButton from "../../components/link_button/link_button";
import {reqLogout, reqUpdateSelf} from "../../api";
import storageUtils from '../../utils/storageUtils';

export default function UpdateForm(props){
    const formRef=useRef();
    const avatarRef=useRef();
    const title=(
        <div>
            <LinkButton onClick={()=>{props.history.goBack()}}>
                <ArrowLeftOutlined />
            </LinkButton>
            修改信息
        </div>
    );
    const layoutCol={
        labelCol:{span:2},
        wrapperCol:{span:8}
    }

    //保存更改信息
    const handleUpdate=async ()=>{
        let userObj=await formRef.current.validateFields().catch(err=>{
            console.log(err);
        });

        if(userObj){
            const avatar=avatarRef.current.getImg();//图片名称
            userObj={...userObj};
            const {grade}=userObj;
            userObj.grade=grade==='2020级'?1:0;
            userObj.avatar=avatar;

            const res=await reqUpdateSelf(userObj);
            if(res.status===0){
                if(userObj.password!==userObj.newpassword){
                    //密码更改，重新登录
                    message.warning('密码更改，请重新登录！');
                    storageUtils.removeUser();
                    // 清除后端认证
                    reqLogout().then(r => {
                        props.history.replace('/login');
                    });
                }else{
                    const user=storageUtils.getUser();
                    user.username=userObj.username;
                    storageUtils.addUser(user);
                    message.success('修改成功');

                    setTimeout(()=>{
                        props.history.goBack();
                    },1000);
                }
            }else{
                message.error(res.msg);
            }
        }
    }

    const {nickname,username,password,grade,avatar}=props.location.state;

    return (
        <Card title={title}>
            <Form
                ref={formRef}
                initialValues={{
                    nickname,
                    username,
                    password,
                    grade:grade?'2020级':'2021级',
                    avatar
                }}
            >
                <Form.Item
                    {...layoutCol}
                    name='username'
                    label='用户名'
                    rules={[
                        {required:true,message:'必须输入!'}
                    ]}
                >
                    <Input disabled={username==='admin'?true:false}/>
                </Form.Item>
                <Form.Item
                    {...layoutCol}
                    name='password'
                    label='原密码'
                    rules={[
                        {required:true,message:'必须输入!'}
                    ]}
                >
                    <Input placeholder='请输入...'/>
                </Form.Item>
                <Form.Item
                    {...layoutCol}
                    name='newpassword'
                    label='新密码'
                    rules={[
                        {required:true,message:'必须输入!'}
                    ]}
                >
                    <Input placeholder='请输入...'/>
                </Form.Item>
                <Form.Item
                    {...layoutCol}
                    name='grade'
                    label='年级'
                >
                    <Select>
                    <Select.Option value='freshman'>2021级</Select.Option>
                    <Select.Option value='sophomore'>2020级</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    {...layoutCol}
                    label='头像'
                >
                    <PicturesWall avatar={avatar} username={username} ref={avatarRef}/>
                </Form.Item>
            </Form>
            <Button 
                style={{backgroundColor:'#7546C8',color:'#fff'}}
                onClick={handleUpdate}
            >保存</Button>
        </Card>
    );
}
