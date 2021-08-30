import React from 'react'
import {
    HomeOutlined,/*首页*/
    LineChartOutlined,/*折线图*/
    ScheduleOutlined,/*考勤管理*/
    TeamOutlined,/*用户管理*/
    UserOutlined,//个人信息
    LinkOutlined/*乐程主站*/
  } from '@ant-design/icons';
 
const menuList = [
    {
        title: '首页',
        key: '/home',
        icon: <HomeOutlined />,
        isPublic:true
    }, 
    {
        title: '考勤管理',
        key: '/attendance',
        icon: <ScheduleOutlined />,
        children: [
            {
                title: '大一',
                key: '/freshman',
                icon: <TeamOutlined />
            }, {
                title: '大二',
                key: '/sophomore',
                icon: <TeamOutlined />
            }
        ]
    }, 
    {
        title: '用户管理',
        key: '/userinfo',
        icon: <TeamOutlined />
    }, 
    {
        title: '个人数据',
        key: '/charts',
        icon: <LineChartOutlined />
    }, 
    {
        title: '个人信息',
        key: '/detail',
        icon: <UserOutlined />
    }, 
    {
        title: '乐程主站',
        key: '/official',
        icon: <LinkOutlined />
    }, 

]
 
export default menuList;