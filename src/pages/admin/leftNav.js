import React,{useEffect,useState} from 'react';
import menuConfig from "../../config/menuConfig";
import {withRouter,Link} from 'react-router-dom';
import {Menu,Layout} from 'antd';
import storageUtils from '../../utils/storageUtils';
import url from '../../assets/images/1.png';
import {BASE_SRC} from '../../utils/constants';
import {reqDetailInfo} from '../../api';

const { SubMenu } = Menu;
const {Sider}=Layout;

const hasAuth=(cur)=>{
    //当前用户为admin
    //菜单名称不是用户管理
    const nickname=storageUtils.getUser().nickname;
    if(nickname==='admin'||cur.title!=='用户管理'){
        return true;
    }
    return false;
}

const LeftNav=(props)=>{
    let menus,selected,openKey,willmount=true;//当前选中
    const [user, setUser] = useState(storageUtils.getUser());

    //构建SubMenu数组
    const initSubMemu=(menuList)=>{
        const menus=menuList.reduce((pre,cur)=>{
            if(hasAuth(cur)){
                if(!cur.children){
                    pre.push(
                        <Menu.Item key={cur.key} icon={cur.icon}>
                            <Link to={cur.key}>{cur.title}</Link>
                        </Menu.Item>)
                }else{
                    if(cur.children.find(item=>item.key===selected)){
                        openKey=cur.key;
                    }
                    pre.push(
                        <SubMenu key={cur.key} icon={cur.icon} title={cur.title}>
                            {initSubMemu(cur.children)}
                        </SubMenu>
                    );
                }
            }
            return pre;
        },[]);
        return menus;
    }

    //获取用户详情
    const getDetail=async ()=>{
        const res=await reqDetailInfo(storageUtils.getUser().nickname||'admin');
        if(res.status===0){
            setUser(res.data);
        }
    }

    if(willmount){
        willmount=false;
        selected=props.location.pathname;
        menus=initSubMemu(menuConfig);
    }

    useEffect(()=>{
        getDetail();
    },[]);

    return (
   
        <Sider className='sider'>
            <div className='sider_header'>
                <div className='avatar'>
                    <img src={user.avatar?BASE_SRC+user.avatar:url} alt='avatar'></img>
                </div>
                <p className='username'>{user.nickname}</p>
            </div>      
            <Menu
                mode="inline"
                theme="dark"
                
                defaultOpenKeys={[openKey]}
                defaultSelectedKeys={[selected]}
                >
                    {menus}
            </Menu>    
        </Sider>    
    );
}

export default withRouter(LeftNav);