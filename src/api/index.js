import ajax from "./ajax";
import ajax1 from "./ajax1";
import { BASE_URL } from "../utils/constants";

//用户注册
export const reqRegister=(user)=>ajax(BASE_URL+'/regis',user,'POST');

//用户登录
// export const reqLogin=(username,password)=>ajax(BASE_URL+'/user/login',{username,password},'POST');
export const reqLogin=(username,password,code)=>ajax(BASE_URL+'/doLogin',{username,password,code},'POST');

//获取数据
export const getUsers=(grade)=>ajax(BASE_URL+'/user/info',{grade});

//获取一周内每天
export const reqDayData=(grade)=>ajax(BASE_URL+'/user/ranking',{grade});

//获取每周数据
export const reqWeekData=(grade)=>ajax(BASE_URL+'/user/week_rank',{grade});

//删除用户
export const reqDeleteUser=(username)=>ajax(BASE_URL+'/manage/delete',{username},'POST');

//修改用户
export const reqUpdateUser=(user)=>ajax(BASE_URL+'/manage/update',user,'POST');

//开始打卡
export const reqStartClock=(username)=>ajax1(BASE_URL+'/user/start',{username});

//结束打卡
export const reqEndClock=(username)=>ajax1(BASE_URL+'/user/end',{username});

//获取用户详情
export const reqDetailInfo=(username)=>ajax(BASE_URL+'/user/detail',{username});

//修改用户信息
export const reqUpdateSelf=(user)=>ajax(BASE_URL+'/user/update',user,'POST');

//打扫卫生
export const reqCleanInfo=()=>ajax(BASE_URL+'/user/clean');

//删除头像
export const reqDeleteAvatar=(username)=>ajax(BASE_URL+'/user/delete',{username},'POST');

//获取菜单
export const reqGetMenuList=()=>ajax(BASE_URL+'/config/menu');

// 打卡无效，仅修改在线状态
export const reqChangeOnline=(username)=>ajax(BASE_URL+'/user/changeOnline',{username},'POST');

// 退出认证
export const reqLogout=()=>ajax(BASE_URL+'/logout');

