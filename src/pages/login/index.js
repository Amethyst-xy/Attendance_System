import React,{useState,useRef} from 'react';
import {Form,Select,Input, Button, message} from 'antd';
import storageUtils from "../../utils/storageUtils";
import './index.less';
import { Redirect } from 'react-router-dom';
import { reqRegister,reqLogin } from "../../api";

const {Option}=Select;

export default function Login(props){
    const [register, setregister] = useState(false);
    const [grade, setgrade] = useState(1);
    const formRef = useRef();

    const layoutCol={
        labelCol:{span:5},
        wrapperCol:{span:19}
    }

    //表单验证并且发送请求
    const onFinish =async (values) => {
        const {nickname,username,password}=values;
        const params={
            nickname,
            username,
            password,
            grade
        }

        if(register){
            //若是注册，提示注册成功，并且显示登录页面
            //首先判断确认密码是否正确
            if(password!==values.repassword){//注意地址的问题
                message.error('请确保两次密码一致');
                formRef.current.resetFields();
            }else{
                const res=await reqRegister(params);
                if(res.status===0){
                    message.success('注册成功');
                    setregister(false);
                    formRef.current.resetFields();
                }else{
                    message.error('注册失败');
                }
            }
        }else{
            const {nickname,password}=params;
            const res=await reqLogin(nickname,password);
            if(res.status===0){
                storageUtils.addUser(res.data);
                message.success('登录成功');
                props.history.replace('/');//跳转首页
            }else{
                message.error(res.msg);
            }
        }
    };

    //获取select的值
    const handleChange=(value)=>{
        setgrade(value);
    }


    if(storageUtils.getUser().username){
        return <Redirect to='/'></Redirect>
    }

    return (
        <div className='login_wrapper'>
        <div className='login_header'>
            <p>乐程软件工作室</p>
        </div>
        <div className='login_form'>
            <p className='form_title'>{register?'用户注册':'用户登录'}</p>
            <Form
                initialValues={{
                    remember: true,
                }}
                {...layoutCol}
                onFinish={onFinish}
                ref={formRef}
                >
                <Form.Item
                    label="用户名"
                    name="nickname"
                    rules={[
                        {
                            required: true,
                            message: '必须输入！',
                        },
                    ]}
                >
                    <Input placeholder='请输入...'/>
                </Form.Item>
                {
                    register?(
                        <Form.Item
                            label="真实姓名"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: '必须输入！',
                                },
                            ]}
                        >
                            <Input placeholder='请输入...'/>
                        </Form.Item>
                    ):''
                }
                <Form.Item
                    label="密码"
                    name="password"
                    {...layoutCol}
                    rules={[
                        {
                            required: true,
                            message: '必须输入！',
                        },
                        {
                            min:6,
                            message:'密码至少6位'
                        }
                    ]}
                >
                    <Input.Password placeholder='请输入...'/>
                </Form.Item>
                {
                    register?(
                        <div>
                            <Form.Item
                                label="确认密码"
                                name="repassword"
                                {...layoutCol}
                                rules={[
                                    {
                                        required: true,
                                        message: '必须输入！',
                                    },
                                    {
                                        min:6,
                                        message:'密码至少6位'
                                    }
                                ]}
                            >
                                <Input.Password placeholder='请输入...'/>
                            </Form.Item>
                            <Form.Item
                                label='年级'
                                {...layoutCol}
                            >
                                <Select 
                                    defaultValue="大一" 
                                    style={{ width: "100%" }} 
                                    onChange={handleChange}
                                >
                                    <Option value={0}>大一</Option>
                                    <Option value={1}>大二</Option>
                                </Select>
                            </Form.Item>
                                <p style={{textAlign:"right",paddingRight:"14px"}}>
                                    已注册？
                                    <span 
                                        style={{cursor:"pointer",color:"#7546C8"}} 
                                        onClick={()=>{setregister(false);formRef.current.resetFields()}}
                                    >点击登录</span>
                                </p>
                        </div>
                    ):(
                        <p style={{textAlign:"right",paddingRight:"14px"}}>
                            还没注册？
                            <span 
                                style={{cursor:"pointer",color:"#7546C8"}} 
                                onClick={()=>{setregister(true);formRef.current.resetFields()}}
                            >点击注册</span>
                        </p>
                    )
                }
                <Form.Item 
                    wrapperCol={{span:24}}
                >
                    <Button type="primary" htmlType="submit" style={{width:"100%"}}>
                        {register?'注册':'登录'}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    </div>
    );
}


// import React from 'react';
// import Redirect from 'react-router-dom'

// export default function Loin(){
//     return <div>hhhh</div>
// }