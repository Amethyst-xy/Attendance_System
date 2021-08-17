function format(str){
    return str<=9?'0'+str:str;
}

export default function dateFormat(time_str){
    let time;
    if(time_str){
        time=new Date(time_str);
    }else{
        time=new Date();
    }
    let hour=format(time.getHours());
    let minutes=(format(time.getMinutes()));
    let seconds=format(time.getSeconds());

    let str=time.getFullYear()+'年'+(time.getMonth()+1)+'月'+time.getDate()+'日 '+hour+':'+minutes+':'+seconds;
    return str;
}