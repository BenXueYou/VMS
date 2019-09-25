export const XyTime = ($event) => {
    
    this.prototype.getCurrentTime=function(format){
        var XyDate = new Date();
        var year = XyDate.getFullYear(); //得到年份
        var month = XyDate.getMonth();//得到月份
        var date = XyDate.getDate();//得到日期
        var day = XyDate.getDay();//得到周几
        var hour = XyDate.getHours();//得到小时
        var minu = XyDate.getMinutes();//得到分钟
        var sec = XyDate.getSeconds();//得到秒
        month = month + 1;
        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;
        if (hour < 10) hour = "0" + hour;
        if (minu < 10) minu = "0" + minu;
        if (sec < 10) sec = "0" + sec;
        var time = "";
        //精确到天
        if(format== 'YYYY-mm-dd'){
            time = year + "-" + month + "-" + date;
        }
        //精确到分
        else if(format== 'YYYY-mm-dd HH-ii-ss'){
            time = year + "-" + month + "-" + date+ " " + hour + ":" + minu + ":" + sec;
        }

	  return time;
    }
}