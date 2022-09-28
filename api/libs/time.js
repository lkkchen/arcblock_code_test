/**
 ****************************************************
 *******---************---***----*******---***----***
 ******---************---**---*********---**---******
 *****---************------***********------*********
 ****---************---**---*********---**---********
 ***----------*****---****----******---****----******
 ****************************************************
 * Created By: Ojasuo
 * Date Time: 2021/3/21 16:46
 */

const moment = require('moment');

const Time = {
    // 以UTC+00:00为基准，前端更具客户端具体时区进行显示
    utc: function () {
       return moment.utc().format();
    },

    getBeijingTime(){
        return moment().format('YYYY-MM-DD HH:mm:ss')
    },

    getDate(){
        return moment().format('YYYY-MM-DD')
    },

    getWeekStartEnd(){
        const nowDay = moment().day();
        console.log(nowDay);

        const start = moment().subtract((nowDay-1), "days").format('YYYY-MM-DD 00:00:00');
        console.log(start);

        const end = moment().add((7-nowDay), "days").format('YYYY-MM-DD 00:00:00');
        console.log(end);
        return {start, end}
    },

    getMonthDayCount(){
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth()+1;
        const d = new Date(year, month, 0);
        return d.getDate();
    },

    getMonthStartEnd(){
        const nowDay = moment().date();
        // console.log(nowDay);
        const start = moment().subtract((nowDay), "days").format('YYYY-MM-DD 00:00:00');
        console.log(start);
        const mDCount = Time.getMonthDayCount();
        const end = moment(start).add(mDCount, "days").format('YYYY-MM-DD 00:00:00');
        console.log(end);
        return {start, end}
    },

};
// Time.getWeekStartEnd();
// Time.getMonthStartEnd();

module.exports = Time;

