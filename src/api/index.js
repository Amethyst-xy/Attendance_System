import ajax from "./ajax";
import { BASE_URL } from "../utils/constants";

//用户注册
export const reqRegister=(user)=>ajax(BASE_URL+'/user/regis',user,'POST');

//用户登录
export const reqLogin=(nickname,password)=>ajax(BASE_URL+'/user/login',{nickname,password},'POST');

//获取数据
export const getUsers=(grade)=>ajax(BASE_URL+'/user/info',{grade});

//获取一周内每天
export const reqDayData=(grade)=>ajax(BASE_URL+'/user/ranking',{grade});

//获取每周数据
export const reqWeekData=(grade)=>ajax(BASE_URL+'/user/week_rank',{grade});

//删除用户
export const reqDeleteUser=(nickname)=>ajax(BASE_URL+'/manage/delete',{nickname},'POST');

//修改用户
export const reqUpdateUser=(user)=>ajax(BASE_URL+'/manage/update',user,'POST');

//开始打卡
export const reqStartClock=(nickname)=>ajax(BASE_URL+'/user/start',{nickname},'POST');

//结束打卡
export const reqEndClock=(nickname)=>ajax(BASE_URL+'/user/end',{nickname},'POST');

//获取用户详情
export const reqDetailInfo=(nickname)=>ajax(BASE_URL+'/user/detail',{nickname});

//修改用户信息
export const reqUpdateSelf=(user)=>ajax(BASE_URL+'/user/update',user,'POST');

//打扫卫生
export const reqCleanInfo=()=>ajax(BASE_URL+'/user/clean');

//删除头像
export const reqDeleteAvatar=(nickname)=>ajax(BASE_URL+'/user/delete',{nickname},'POST');

