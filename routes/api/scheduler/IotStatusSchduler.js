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

var express = require('express');
var router = express.Router();
const schedule = require('node-schedule');



const set = (s)=>{
    // 1. 1분마다, 실행 설정
    const rule = new schedule.RecurrenceRule();
    rule.second = 0;
    
    const job = schedule.scheduleJob(rule, async function(){
        console.log('IotStatus 1분마다 스케줄 확인');

        let initResult = await ScheduleJobManager.initWithConnPool(pool);

        if(!initResult.success) {
        //init failed;
            console.log('init failed!');
        }else {
            // 2. 1분마다의 알림 컬럼별 Status 확인하기
            const oneMinuteQuery = 'select * from test where date between date_add(?, interval -1 minute) and ? and date not in (?)';
            const oneMinuteResult = await db.queryParam_Parse(oneMinuteQuery, ['2021-09-05 00:01:00', '2021-09-05 00:01:00', '2021-09-05 00:01:00']);
            console.log(oneMinuteResult);            
            // 3. 각 5가지의 알림컬럼별의 Status 별 비교
            const querylen = oneMinuteResult.length;
            
            for(var i = 0; i < querylen; i++) {
                var alarmV = oneMinuteResult[i].AlarmVoltage;
                console.log("----")
                // (1) 전압 알람
                switch(alarmV) { 
                    case 1:
                        if(oneMinuteResult[i].VoltageAvg >= 243) {
                            // 주의
                            console.log("1. 전압 주의")
                            const insertQuery = 'INSERT INTO DangerIot (IotNum, Date) VALUES (?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IotNum, oneMinuteResult[i].Date]);
                        }
                        else{
                            console.log("1. 전압 안전")
                        }
                        break;
                    case 2:
                        if(oneMinuteResult[i].VoltageAvg <= 207) {
                            // 주의
                            console.log("1. 전압 주의")
                            const insertQuery = 'INSERT INTO DangerIot (IotNum, Date) VALUES (?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IotNum, oneMinuteResult[i].Date]);
                        }
                        else{
                            console.log("1. 전압 안전")
                        }
                        break;
                    case 4:
                        if(oneMinuteResult[i].VoltageMin <= 190) {
                            // 주의
                            console.log("1. 전압 주의")
                            const insertQuery = 'INSERT INTO DangerIot (IotNum, Date) VALUES (?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IotNum, oneMinuteResult[i].Date]);
                        }
                        else{
                            console.log("1. 전압 안전")
                        }
                        break;
                    case 6:
                        if(oneMinuteResult[i].VoltageAvg <= 207 && oneMinuteResult[i].VoltageMin <= 190) {
                            // 주의
                            console.log("1. 전압 주의")
                            const insertQuery = 'INSERT INTO DangerIot (IotNum, Date) VALUES (?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IotNum, oneMinuteResult[i].Date]);
                        }
                        else{
                            console.log("1. 전압 안전")
                        }
                        break;
                    case 7:
                        if(oneMinuteResult[i].VoltageAvg >= 243 && oneMinuteResult[i].VoltageAvg <= 207 && oneMinuteResult[i].VoltageMin <= 190) {
                            // 주의
                            console.log("1. 전압 주의")
                            const insertQuery = 'INSERT INTO DangerIot (IotNum, Date) VALUES (?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IotNum, oneMinuteResult[i].Date]);
                        }
                        else{
                            console.log("1. 전압 안전")
                        }
                        break;
                    case 0:
                        console.log("1. 전압 안전")
                        break;
                }
        
                var alarmI = oneMinuteResult[i].AlarmElectric;
                // (2) 전류 알람
                switch(alarmI) { 
                    case 1:
                        if(oneMinuteResult[i].ElectricAvg >= 200) {
                            // 주의
                            console.log("2. 전류 주의")
                            const insertQuery = 'INSERT INTO DangerIot (IotNum, Date) VALUES (?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IotNum, oneMinuteResult[i].Date]);
                        }
                        else{
                            console.log("2. 전류 안전")
                        }
                        break;
                    case 2:
                        if(oneMinuteResult[i].ElectricMax >= 400) {
                            // 주의
                            console.log("2. 전류 주의")
                            const insertQuery = 'INSERT INTO DangerIot (IotNum, Date) VALUES (?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IotNum, oneMinuteResult[i].Date]);
                        }
                        else{
                            console.log("2. 전류 안전")
                        }
                        break;
                    case 3:
                        if(oneMinuteResult[i].ElectricAvg >= 200 && oneMinuteResult[i].ElectricMax >= 400) {
                            // 주의
                            console.log("2. 전류 주의")
                            const insertQuery = 'INSERT INTO DangerIot (IotNum, Date) VALUES (?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IotNum, oneMinuteResult[i].Date]);
                        }
                        else{
                            console.log("2. 전류 안전")
                        }
                        break;
                    case 0:
                        console.log("2. 전류 안전")
                        break;
                }
        
                var alarmIg = oneMinuteResult[i].AlarmLeakage;
                // (3) 누설전류 알람
                switch(alarmIg) { 
                    case 1:
                        if(oneMinuteResult[i].LeakageAvgX >= 8) {
                            // 주의
                            console.log("3. 누설전류 주의")
                            const insertQuery = 'INSERT INTO DangerIot (IotNum, Date) VALUES (?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IotNum, oneMinuteResult[i].Date]);
                        }
                        else{
                            console.log("3. 누설전류 안전")
                        }
                        break;
                    case 2:
                        if(oneMinuteResult[i].LeakageCurrentX >= 30) {
                            // 주의
                            console.log("3. 누설전류 주의")
                            const insertQuery = 'INSERT INTO DangerIot (IotNum, Date) VALUES (?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IotNum, oneMinuteResult[i].Date]);
                        }
                        else{
                            console.log("3. 누설전류 안전")
                        }
                        break;
                    case 3:
                        if(oneMinuteResult[i].LeakageAvgX >= 8 && oneMinuteResult[i].LeakageCurrentX >= 30) {
                            // 주의
                            console.log("3. 누설전류 주의")
                            const insertQuery = 'INSERT INTO DangerIot (IotNum, Date) VALUES (?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IotNum, oneMinuteResult[i].Date]);
                        }
                        else{
                            console.log("3. 누설전류 안전")
                        }
                        break;
                    case 0:
                        console.log("3. 누설전류 안전")
                        break;
                }
        
                var alarmArc = oneMinuteResult[i].AlarmArc;
                // (4) 아크 알람
                switch(alarmArc) { 
                    case 1:
                        if(oneMinuteResult[i].ArcMax >= 100) {
                            // 주의
                            console.log("4. 아크 주의")
                            const insertQuery = 'INSERT INTO DangerIot (IotNum, Date) VALUES (?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IotNum, oneMinuteResult[i].Date]);
                        }
                        else{
                            console.log("4. 아크 안전")
                        }
                        break;
                    case 0:
                        console.log("4. 아크 안전")
                        break;
                }
        
                var alarmTemp = oneMinuteResult[i].AlarmTemperature;
                // (5) 온도 알람
                switch(alarmTemp) { 
                    case 1:
                        if(oneMinuteResult[i].Temperature >= 80) {
                            // 주의
                            console.log("5. 온도 안전")
                            const insertQuery = 'INSERT INTO DangerIot (IotNum, Date) VALUES (?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IotNum, oneMinuteResult[i].Date]);
                        }
                        {
                            console.log("5. 온도 안전")
                        }
                        break;
                    case 0:
                        console.log("5. 온도 안전")
                        break;
                }

            // 

        }
}
    
})
}

set();


module.exports = router;

