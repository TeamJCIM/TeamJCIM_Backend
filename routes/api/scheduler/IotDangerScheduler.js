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
        } else {
            // 2. 1분마다의 알림 컬럼별 Status 확인하기
            const oneMinuteQuery = 'SELECT count(*) as DangerCount, IotNum, AlarmVoltage, AlarmElectric, AlarmLeakage, AlarmArc, AlarmTemperature FROM CautionIot WHERE DATE between date_add(?, interval -15 minute) and ? GROUP BY IotNum, AlarmVoltage, AlarmElectric, AlarmLeakage, AlarmArc, AlarmTemperature';
            const oneMinuteResult = await db.queryParam_Parse(oneMinuteQuery, ['2021-09-05 00:15:00', '2021-09-05 00:15:00']);
            console.log(oneMinuteResult);            
            // 3. 각 5가지의 알림컬럼별의 Status 별 비교
            const querylen = oneMinuteResult.length;
            
            for(var i = 0; i < querylen; i++) {
                if(oneMinuteResult[i].DangerCount >= 10) {
                    const insertQuery = 'INSERT INTO DangerIot (IotNum, Date, AlarmVoltage, AlarmElectric, AlarmLeakage, AlarmArc, AlarmTemperature) VALUES (?,?,?,?,?,?,?)';
                    const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IotNum, '2021-09-05 00:15:00', oneMinuteResult[i].AlarmVoltage, oneMinuteResult[i].AlarmElectric, oneMinuteResult[i].AlarmLeakage, oneMinuteResult[i].AlarmArc, oneMinuteResult[i].AlarmTemperature]);
                }
            }

        }
    });
}

set();


module.exports = router;

