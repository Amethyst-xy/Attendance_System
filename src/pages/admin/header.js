import React, {useState, useEffect, useRef} from 'react';
import LinkButton from '../../components/link_button/link_button';
import {PlusOutlined, SoundOutlined} from '@ant-design/icons';
import {Button, Layout, Modal, Drawer, Alert, Space, Form, Col, Input, Select, message} from 'antd';
import menuConfig from "../../config/menuConfig";
import storageUtils from '../../utils/storageUtils';
import {
    addAnnouncement,
    deleteAnnouncement,
    reqAnnouncement,
    reqCleanInfo,
    reqLogin,
    reqLogout,
    reqRegister
} from '../../api';
import {withRouter} from 'react-router-dom';
import {Option} from "antd/es/mentions";
import TextArea from "antd/es/input/TextArea";


const {Header}= Layout;

const HeaderPart=(props)=>{
    const [isAdmin, setIsAdmin] = useState(false);
    const getRole = () => {
        if (storageUtils.getUser().roles[0].id === 1) {
            setIsAdmin(true);
        }
    }


    const [clean, setclean] = useState({});
    const [announcements, setannouncements] = useState([]);
    const alertClose = (id) => {
        console.log(id);
        const res = deleteAnnouncement(id);
        if(res.status===0){
            getAnnouncement();
        }
    }
    const allAnnouncement = announcements.map((announcement) =>
        <li key={announcement.id.toString()}>
            <p><Alert
                message={announcement.message}
                description={announcement.description}
                type={announcement.type}
                closable={isAdmin}
                onClose={()=>{alertClose(announcement.id)}}
            /></p>
        </li>
    );

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
                reqLogout().then(resp=>{
                    if (resp) {
                        storageUtils.removeUser();
                        props.history.replace('/login');
                    }
                });

            }
        });
    }

    //获取用户详情
    const getCleanInfo=async ()=>{
        const res=await reqCleanInfo();
        if(res.status===0){
            setclean(res.data);
        }
    }

    // 获取公告信息
    const getAnnouncement=async ()=>{
        const res = await reqAnnouncement();
        if (res.status===0) {
            setannouncements(res.data);
        }
    }


    const [visible, setVisible] = useState(false);
    const [childrenDrawer, setChildrenDrawer] = useState(false);

    const showDrawer = () => {
        getAnnouncement();
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const showChildrenDrawer = () => {
        setChildrenDrawer(true);
    };

    const onChildrenDrawerClose = () => {
        setChildrenDrawer(false);
    };

    const formRef = useRef();
    const onSubmit = async (values) => {
        const {type, message, description}=values;
        const params={
            type,
            message,
            description
        }
        const res=await addAnnouncement(params.type, params.message, params.description);
        if(res.status===0){
            setChildrenDrawer(false);
            formRef.current.resetFields();
            getAnnouncement();
        }
    };



    useEffect(()=>{
        getRole();
        getCleanInfo();
        getAnnouncement();
    },[]);


    return (
        <>
        <Header style={{backgroundColor:"#fff",padding:0}}>
            <div className='top'>
                <Button type='primary' className='top-left' onClick={showDrawer} icon={<SoundOutlined />}>公告</Button>
                <Drawer
                    title="公告"
                    placement="right"
                    onClose={onClose}
                    visible={visible}
                    extra={
                        isAdmin ?
                        (<Space>
                            <Button type="primary" onClick={showChildrenDrawer} icon={<PlusOutlined />}>
                                添加公告
                            </Button>
                        </Space>) : ''
                    }
                >
                    <ul>{allAnnouncement}</ul>

                    <Drawer
                        title="添加公告"
                        width={320}
                        closable={false}
                        onClose={onChildrenDrawerClose}
                        visible={childrenDrawer}>
                        <Form
                            name="basic"
                            layout="vertical"
                            onFinish={onSubmit}
                            ref={formRef}
                        >
                            <Form.Item
                                label="type"
                                name="type"
                            >
                                <Select placeholder="公告类型" style={{ width: 120 }}>
                                    <Option value="info">通知</Option>
                                    <Option value="error">危</Option>
                                    <Option value="success">好事</Option>
                                    <Option value="warning">警告</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="message"
                                name="message"
                            >
                                <Input placeholder="摘要"/>
                            </Form.Item>

                            <Form.Item
                                label="description"
                                name="description">
                                <TextArea placeholder="详细信息" allowClear />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>

                    </Drawer>
                </Drawer>
                <div className='top_right'>
                    Hi~{storageUtils.getUser().username}
                    <LinkButton onClick={logOut}>退出</LinkButton>
                </div>

            </div>
            <div className='bottom'>
                <div className='bottom_left'>{getTitle()}</div>
                <div className='bottom_right'>当前是第{clean.week}周，卫生:{clean.username}</div>
            </div>
        </Header>
        </>

    );
}

export default withRouter(HeaderPart);