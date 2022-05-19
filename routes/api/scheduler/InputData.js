var express = require('express');
var router = express.Router();
const ScheduleJobManager = require('node-schedule-manager').ScheduleJobManager;

/*crypto : 암호화모듈 */
const crypto = require('crypto-promise');

/* 결과값 출력 모듈 세가지*/
const defaultRes = require('../../../module/utils/utils'); 
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage')
/* db 연결 모듈 */
const db = require('../../../module/pool');
/* jwt 토큰 모듈 */
const jwtUtils = require('../../../module/jwt');

const pool = require("../../../config/dbConfig");

var moment = require('moment');
now_date = moment().format('YYYY-MM-DD')
var express = require('express');
var router = express.Router();
const schedule = require('node-schedule');
now_m = moment().format('mm')
now_s = moment().format('ss')
data = moment().format('YYYY-MM-DD hh:mm:ss')

const set = (s)=>{
    // 1. 1분마다, 실행 설정
    // const rule = new schedule.RecurrenceRule();
    // rule.second = 0;
    const rule = '* * * * * *';
    
    const job = schedule.scheduleJob(rule, async function(){
        console.log('IotStatus 1분마다 스케줄 확인');

        let initResult = await ScheduleJobManager.initWithConnPool(pool);

        if(!initResult.success) {
        //init failed;
            console.log('init failed!');
        }else {
            // 2. 1분마다의 현재의 실시간 분초와 IotNum 에 맞는 쿼리를 확인한다
            const oneMinuteQuery = 'SELECT * FROM RealTimeData where Minute = ? and Second = ?';
            const oneMinuteResult = await db.queryParam_Parse(oneMinuteQuery, [moment().format('mm'), moment().format('ss')]);
            console.log(oneMinuteResult);            
            // 3. 만약에 있다면 insert 하자.

            if(!oneMinuteResult[0]){
                console.log("데이터 없음")
            }
            else{
                for(var i = 0; i < oneMinuteResult.length; i++){
                    IoTNum = oneMinuteResult[i].IotNum
                    // Date = oneMinuteResult[0].
                    VoltageAvg = oneMinuteResult[i].VoltageAvg
                    VoltageMin = oneMinuteResult[i].VoltageMin
                    ElectricAvg = oneMinuteResult[i].ElectricAvg
                    ElectricMax = oneMinuteResult[i].ElectricMax
                    LeakageAvgX = oneMinuteResult[i].LeakageAvgX
                    LeakageCurrentX = oneMinuteResult[i].LeakageCurrentX
                    ArcMax = oneMinuteResult[i].ArcMax
                    AlarmVoltage = oneMinuteResult[i].AlarmVoltage
                    AlarmElectric = oneMinuteResult[i].AlarmElectric
                    AlarmLeakage = oneMinuteResult[i].AlarmLeakage
                    AlarmArc = oneMinuteResult[i].AlarmArc
                    AlarmTemperature = oneMinuteResult[i].AlarmTemperature
    
    
                    const InsertQuery = 'insert into DataOfIotMinute'+
                    '(IoTNum, Date, '+
                    'VoltageAvg, VoltageMin, '+
                    'ElectricAvg, ElectricMax, '+
                    'LeakageAvgX, LeakageCurrentX,'+
                    'ArcMax, '+
                    'AlarmVoltage, AlarmElectric, AlarmLeakage, AlarmArc, AlarmTemperature)'+
                    'values (?,?,?,?,?,?,?,?,?,?,?,?,?,?);'
    
                    const InsertQueryResult = await db.queryParam_Parse(InsertQuery, [IoTNum,moment().format('YYYY-MM-DD hh:mm:ss'),VoltageAvg,VoltageMin,ElectricAvg,ElectricMax,LeakageAvgX,LeakageCurrentX,ArcMax,AlarmVoltage,AlarmElectric,AlarmLeakage,AlarmArc,AlarmTemperature])
                    if(!InsertQueryResult){
                        console.log("데이터 있지만 insert 싪패")
                    }
                    else{
                        console.log("데이터 있고 insert 성공")
                        console.log(InsertQueryResult)
                    }


                }
                

                
            }

        }
})
}

set();


module.exports = router;