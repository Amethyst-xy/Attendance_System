import React from 'react';
import menuConfig from "../../config/menuConfig";
import {withRouter,Link} from 'react-router-dom';
import {Menu} from 'antd';
import storageUtils from '../../utils/storageUtils';

const { SubMenu } = Menu;

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

    if(willmount){
        willmount=false;
        selected=props.location.pathname;
        menus=initSubMemu(menuConfig);
    }

    return (
        <Menu
            mode="inline"
            theme="dark"
            
            defaultOpenKeys={[openKey]}
            defaultSelectedKeys={[selected]}
            >
                {menus}
        </Menu>        
    );
}

export default withRouter(LeftNav);