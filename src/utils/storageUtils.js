import store from "store";

const USER_KEY='user_key';

const ONLINE='online';


const storageUtils={
    //添加user
    addUser:user=>store.set(USER_KEY,user),

    //获取user
    getUser:()=>store.get(USER_KEY)||{},

    //删除user
    removeUser:()=>store.remove(USER_KEY),

    //添加打卡状态
    addStatus:(status)=>store.set(ONLINE,status),

    //获取打卡状态
    getStatus:()=>store.get(ONLINE),



}

export default storageUtils;