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
var moment = require('moment');
// moment().format('YYYY-MM-DD hh:mm:ss')
const messageSend = require('../auth/send_message');

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
            const oneMinuteQuery = 'select * from DataOfIotMinute where date between date_add(?, interval -1 minute) and ? and date not in (?)';
            const oneMinuteResult = await db.queryParam_Parse(oneMinuteQuery, [moment().format('YYYY-MM-DD hh:mm:ss'), moment().format('YYYY-MM-DD hh:mm:ss'), moment().format('YYYY-MM-DD hh:mm:ss')]);
            console.log(oneMinuteResult);            
            console.log("체킹하기");            
            
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
                            const insertQuery = 'INSERT INTO CautionIot (IotNum, Date, AlarmVoltage, AlarmElectric, AlarmLeakage, AlarmArc, AlarmTemperature) VALUES (?,?,?,?,?,?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IoTNum, oneMinuteResult[i].Date, oneMinuteResult[i].AlarmVoltage, oneMinuteResult[i].AlarmElectric, oneMinuteResult[i].AlarmLeakage, oneMinuteResult[i].AlarmArc, oneMinuteResult[i].AlarmTemperature]);

                            const selectQuery = 'SELECT Phone FROM team_JCIM.user where IotNum = ?;';
                            const selectResult = await db.queryParam_Parse(selectQuery, [oneMinuteResult[i].IoTNum]);
//                             messageSend.send_message(selectResult[0].Phone, '현재 과전압 주의 상태입니다');
                        }
                        else{
                            console.log("1. 전압 안전")
                        }
                        break;
                    case 2:
                        if(oneMinuteResult[i].VoltageAvg <= 207) {
                            // 주의
                            console.log("1. 전압 주의")
                            const insertQuery = 'INSERT INTO CautionIot (IotNum, Date, AlarmVoltage, AlarmElectric, AlarmLeakage, AlarmArc, AlarmTemperature) VALUES (?,?,?,?,?,?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IoTNum, oneMinuteResult[i].Date, oneMinuteResult[i].AlarmVoltage, oneMinuteResult[i].AlarmElectric, oneMinuteResult[i].AlarmLeakage, oneMinuteResult[i].AlarmArc, oneMinuteResult[i].AlarmTemperature]);

                            const selectQuery = 'SELECT Phone FROM team_JCIM.user where IotNum = ?;';
                            const selectResult = await db.queryParam_Parse(selectQuery, [oneMinuteResult[i].IoTNum]);
//                             messageSend.send_message(selectResult[0].Phone, '현재 부족전압 주의 상태입니다');
                        }
                        else{
                            console.log("1. 전압 안전")
                        }
                        break;
                    case 4:
                        if(oneMinuteResult[i].VoltageMin <= 190) {
                            // 주의
                            console.log("1. 전압 주의")
                            const insertQuery = 'INSERT INTO CautionIot (IotNum, Date, AlarmVoltage, AlarmElectric, AlarmLeakage, AlarmArc, AlarmTemperature) VALUES (?,?,?,?,?,?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IoTNum, oneMinuteResult[i].Date, oneMinuteResult[i].AlarmVoltage, oneMinuteResult[i].AlarmElectric, oneMinuteResult[i].AlarmLeakage, oneMinuteResult[i].AlarmArc, oneMinuteResult[i].AlarmTemperature]);
                            
                            const selectQuery = 'SELECT Phone FROM team_JCIM.user where IotNum = ?;';
                            const selectResult = await db.queryParam_Parse(selectQuery, [oneMinuteResult[i].IoTNum]);
//                             messageSend.send_message(selectResult[0].Phone, '현재 정전 주의 상태입니다');
                        }
                        else{
                            console.log("1. 전압 안전")
                        }
                        break;
                    case 6:
                        if(oneMinuteResult[i].VoltageAvg <= 207 && oneMinuteResult[i].VoltageMin <= 190) {
                            // 주의
                            console.log("1. 전압 주의")
                            const insertQuery = 'INSERT INTO CautionIot (IotNum, Date, AlarmVoltage, AlarmElectric, AlarmLeakage, AlarmArc, AlarmTemperature) VALUES (?,?,?,?,?,?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IoTNum, oneMinuteResult[i].Date, oneMinuteResult[i].AlarmVoltage, oneMinuteResult[i].AlarmElectric, oneMinuteResult[i].AlarmLeakage, oneMinuteResult[i].AlarmArc, oneMinuteResult[i].AlarmTemperature]);
                        
                            const selectQuery = 'SELECT Phone FROM team_JCIM.user where IotNum = ?;';
                            const selectResult = await db.queryParam_Parse(selectQuery, [oneMinuteResult[i].IoTNum]);
//                             messageSend.send_message(selectResult[0].Phone, '현재 부족전압, 정전 주의 상태입니다');
                        }
                        else{
                            console.log("1. 전압 안전")
                        }
                        break;
                    case 7:
                        if(oneMinuteResult[i].VoltageAvg >= 243 && oneMinuteResult[i].VoltageAvg <= 207 && oneMinuteResult[i].VoltageMin <= 190) {
                            // 주의
                            console.log("1. 전압 주의")
                            const insertQuery = 'INSERT INTO CautionIot (IotNum, Date, AlarmVoltage, AlarmElectric, AlarmLeakage, AlarmArc, AlarmTemperature) VALUES (?,?,?,?,?,?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IoTNum, oneMinuteResult[i].Date, oneMinuteResult[i].AlarmVoltage, oneMinuteResult[i].AlarmElectric, oneMinuteResult[i].AlarmLeakage, oneMinuteResult[i].AlarmArc, oneMinuteResult[i].AlarmTemperature]);
                            
                            const selectQuery = 'SELECT Phone FROM team_JCIM.user where IotNum = ?;';
                            const selectResult = await db.queryParam_Parse(selectQuery, [oneMinuteResult[i].IoTNum]);
//                             messageSend.send_message(selectResult[0].Phone, '현재 과전압, 부족전압, 정전 주의 상태입니다');
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
                            const insertQuery = 'INSERT INTO CautionIot (IotNum, Date, AlarmVoltage, AlarmElectric, AlarmLeakage, AlarmArc, AlarmTemperature) VALUES (?,?,?,?,?,?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IoTNum, oneMinuteResult[i].Date, oneMinuteResult[i].AlarmVoltage, oneMinuteResult[i].AlarmElectric, oneMinuteResult[i].AlarmLeakage, oneMinuteResult[i].AlarmArc, oneMinuteResult[i].AlarmTemperature]);
                            
                            const selectQuery = 'SELECT Phone FROM team_JCIM.user where IotNum = ?;';
                            const selectResult = await db.queryParam_Parse(selectQuery, [oneMinuteResult[i].IoTNum]);
//                             messageSend.send_message(selectResult[0].Phone, '현재 과전류 주의 상태입니다');
                        }
                        else{
                            console.log("2. 전류 안전")
                        }
                        break;
                    case 2:
                        if(oneMinuteResult[i].ElectricMax >= 400) {
                            // 주의
                            console.log("2. 전류 주의")
                            const insertQuery = 'INSERT INTO CautionIot (IotNum, Date, AlarmVoltage, AlarmElectric, AlarmLeakage, AlarmArc, AlarmTemperature) VALUES (?,?,?,?,?,?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IoTNum, oneMinuteResult[i].Date, oneMinuteResult[i].AlarmVoltage, oneMinuteResult[i].AlarmElectric, oneMinuteResult[i].AlarmLeakage, oneMinuteResult[i].AlarmArc, oneMinuteResult[i].AlarmTemperature]);
                        
                            const selectQuery = 'SELECT Phone FROM team_JCIM.user where IotNum = ?;';
                            const selectResult = await db.queryParam_Parse(selectQuery, [oneMinuteResult[i].IoTNum]);
//                             messageSend.send_message(selectResult[0].Phone, '현재 단락 주의 상태입니다');
                        }
                        else{
                            console.log("2. 전류 안전")
                        }
                        break;
                    case 3:
                        if(oneMinuteResult[i].ElectricAvg >= 200 && oneMinuteResult[i].ElectricMax >= 400) {
                            // 주의
                            console.log("2. 전류 주의")
                            const insertQuery = 'INSERT INTO CautionIot (IotNum, Date, AlarmVoltage, AlarmElectric, AlarmLeakage, AlarmArc, AlarmTemperature) VALUES (?,?,?,?,?,?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IoTNum, oneMinuteResult[i].Date, oneMinuteResult[i].AlarmVoltage, oneMinuteResult[i].AlarmElectric, oneMinuteResult[i].AlarmLeakage, oneMinuteResult[i].AlarmArc, oneMinuteResult[i].AlarmTemperature]);
                        
                            const selectQuery = 'SELECT Phone FROM team_JCIM.user where IotNum = ?;';
                            const selectResult = await db.queryParam_Parse(selectQuery, [oneMinuteResult[i].IoTNum]);
//                             messageSend.send_message(selectResult[0].Phone, '현재 과전류, 단락 주의 상태입니다');
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
                            const insertQuery = 'INSERT INTO CautionIot (IotNum, Date, AlarmVoltage, AlarmElectric, AlarmLeakage, AlarmArc, AlarmTemperature) VALUES (?,?,?,?,?,?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IoTNum, oneMinuteResult[i].Date, oneMinuteResult[i].AlarmVoltage, oneMinuteResult[i].AlarmElectric, oneMinuteResult[i].AlarmLeakage, oneMinuteResult[i].AlarmArc, oneMinuteResult[i].AlarmTemperature]);
                        
                            const selectQuery = 'SELECT Phone FROM team_JCIM.user where IotNum = ?;';
                            const selectResult = await db.queryParam_Parse(selectQuery, [oneMinuteResult[i].IoTNum]);
//                             messageSend.send_message(selectResult[0].Phone, '현재 누설전류감지 주의 상태입니다');
                        }
                        else{
                            console.log("3. 누설전류 안전")
                        }
                        break;
                    case 2:
                        if(oneMinuteResult[i].LeakageCurrentX >= 30) {
                            // 주의
                            console.log("3. 누설전류 주의")
                            const insertQuery = 'INSERT INTO CautionIot (IotNum, Date, AlarmVoltage, AlarmElectric, AlarmLeakage, AlarmArc, AlarmTemperature) VALUES (?,?,?,?,?,?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IoTNum, oneMinuteResult[i].Date, oneMinuteResult[i].AlarmVoltage, oneMinuteResult[i].AlarmElectric, oneMinuteResult[i].AlarmLeakage, oneMinuteResult[i].AlarmArc, oneMinuteResult[i].AlarmTemperature]);
                            
                            const selectQuery = 'SELECT Phone FROM team_JCIM.user where IotNum = ?;';
                            const selectResult = await db.queryParam_Parse(selectQuery, [oneMinuteResult[i].IoTNum]);
//                             messageSend.send_message(selectResult[0].Phone, '현재 누전차단기 동적 전류 발생 주의 상태입니다');
                        }
                        else{
                            console.log("3. 누설전류 안전")
                        }
                        break;
                    case 3:
                        if(oneMinuteResult[i].LeakageAvgX >= 8 && oneMinuteResult[i].LeakageCurrentX >= 30) {
                            // 주의
                            console.log("3. 누설전류 주의")
                            const insertQuery = 'INSERT INTO CautionIot (IotNum, Date, AlarmVoltage, AlarmElectric, AlarmLeakage, AlarmArc, AlarmTemperature) VALUES (?,?,?,?,?,?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IoTNum, oneMinuteResult[i].Date, oneMinuteResult[i].AlarmVoltage, oneMinuteResult[i].AlarmElectric, oneMinuteResult[i].AlarmLeakage, oneMinuteResult[i].AlarmArc, oneMinuteResult[i].AlarmTemperature]);
                            
                            const selectQuery = 'SELECT Phone FROM team_JCIM.user where IotNum = ?;';
                            const selectResult = await db.queryParam_Parse(selectQuery, [oneMinuteResult[i].IoTNum]);
//                             messageSend.send_message(selectResult[0].Phone, '현재 누설전류감지, 누전차단기 동적 전류 발생 주의 상태입니다');
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
                            const insertQuery = 'INSERT INTO CautionIot (IotNum, Date, AlarmVoltage, AlarmElectric, AlarmLeakage, AlarmArc, AlarmTemperature) VALUES (?,?,?,?,?,?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IoTNum, oneMinuteResult[i].Date, oneMinuteResult[i].AlarmVoltage, oneMinuteResult[i].AlarmElectric, oneMinuteResult[i].AlarmLeakage, oneMinuteResult[i].AlarmArc, oneMinuteResult[i].AlarmTemperature]);
                        
                            const selectQuery = 'SELECT Phone FROM team_JCIM.user where IotNum = ?;';
                            const selectResult = await db.queryParam_Parse(selectQuery, [oneMinuteResult[i].IoTNum]);
//                             messageSend.send_message(selectResult[0].Phone, '현재 아크발생 주의 상태입니다');
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
                            const insertQuery = 'INSERT INTO CautionIot (IotNum, Date, AlarmVoltage, AlarmElectric, AlarmLeakage, AlarmArc, AlarmTemperature) VALUES (?,?,?,?,?,?,?)';
                            const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IoTNum, oneMinuteResult[i].Date, oneMinuteResult[i].AlarmVoltage, oneMinuteResult[i].AlarmElectric, oneMinuteResult[i].AlarmLeakage, oneMinuteResult[i].AlarmArc, oneMinuteResult[i].AlarmTemperature]);
                        
                            const selectQuery = 'SELECT Phone FROM team_JCIM.user where IotNum = ?;';
                            const selectResult = await db.queryParam_Parse(selectQuery, [oneMinuteResult[i].IoTNum]);
//                             messageSend.send_message(selectResult[0].Phone, '현재 기기 온도 주의 상태입니다');
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

