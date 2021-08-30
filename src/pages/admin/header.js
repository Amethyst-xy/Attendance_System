import React,{useState,useEffect} from 'react';
import LinkButton from '../../components/link_button/link_button';
import {Layout,Modal} from 'antd';
import menuConfig from "../../config/menuConfig";
import storageUtils from '../../utils/storageUtils';
import {reqCleanInfo} from '../../api';
import {withRouter} from 'react-router-dom';


const {Header}= Layout;

const HeaderPart=(props)=>{
    const [clean, setclean] = useState({});

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

    //获取用户详情
    const getCleanInfo=async ()=>{
        const res=await reqCleanInfo();
        if(res.status===0){
            setclean(res.data);
        }
    }

    useEffect(()=>{
        getCleanInfo();
    },[]);


    return (
        <Header style={{backgroundColor:"#fff",padding:0}}>
            <div className='top'>
                Hi~{storageUtils.getUser().nickname}
                <LinkButton onClick={logOut}>退出</LinkButton>
            </div>
            <div className='bottom'>
                <div className='bottom_left'>{getTitle()}</div>
                <div className='bottom_right'>当前是第{clean.week+1}周，卫生:{clean.username}</div>
            </div>
        </Header>
    );
}

export default withRouter(HeaderPart);