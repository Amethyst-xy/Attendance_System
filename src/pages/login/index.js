import React,{useState,useRef} from 'react';
import {Form, Select, Input, Button, message} from 'antd';
import storageUtils from "../../utils/storageUtils";
import './index.less';
import {reqRegister, reqLogin} from "../../api";

const {Option}=Select;

export default function Login(props){
    const [register, setregister] = useState(false);
    const [imgsrc,setimgsrc]=useState('/verifyCode?time='+new Date());
    const formRef = useRef();

    const layoutCol={
        labelCol:{span:5},
        wrapperCol:{span:19}
    }

    const updateVerifyCode = async (values) => {
        setimgsrc('/verifyCode?time='+new Date())
    }


    //表单验证并且发送请求
    const onFinish =async (values) => {
        const {username,nickname,password,grade,code}=values;
        const params={
            username,
            nickname,
            password,
            grade,
            code,
            // passphrase
        }

        if(register){
            // 若是注册，提示注册成功，并且显示登录页面
            // 首先判断确认密码是否正确
            if(password!==values.repassword){//注意地址的问题
                message.error('请确保两次密码一致');
                formRef.current.resetFields();
            }else{
                const res=await reqRegister(params);
                if(res.status===0){
                    setregister(false);
                    formRef.current.resetFields();
                }
            }
        }else{
            const {username,password, code}=params;
            const res=await reqLogin(username,password,code);
            if(res.status===0){
                storageUtils.addUser(res.data);
                setTimeout(()=>{
                },1000);
                props.history.replace('/');//跳转首页
            }else{
                await updateVerifyCode();
                formRef.current.resetFields();
            }
        }
    };

    // if(storageUtils.getUser().username){
    //     return <Redirect to='/'/>
    // }

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
                    grade:0
                }}
                {...layoutCol}
                onFinish={onFinish}
                ref={formRef}
                >
                <Form.Item
                    label="用户名"
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
                {
                    register?(
                        <Form.Item
                            label="真实姓名"
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
                    !register?(
                        <div>
                            <Form.Item
                                label="验证码"
                                name="code"
                                {...layoutCol}
                                rules={[
                                    {
                                        required: true,
                                        message: '必须输入！',
                                    }
                                ]}
                            >
                                <Input placeholder='请输入...'/>
                            </Form.Item>
                            <img src={imgsrc} onClick={updateVerifyCode} alt={'验证码'}/>
                        </div>
                    ):''
                }


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
                                name='grade'
                                label='年级'
                                {...layoutCol}
                            >
                                <Select 
                                    style={{ width: "100%" }} 
                                >
                                    <Option value={0}>大一</Option>
                                    <Option value={1}>大二</Option>
                                    <Option value={2}>其他年级</Option>
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

