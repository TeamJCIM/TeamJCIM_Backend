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

const messageSend = require('../auth/send_message');
var moment = require('moment');


const set = (s)=>{
    // 1. 1분마다, 실행 설정
    const rule = new schedule.RecurrenceRule();
    rule.second = 0;
    
    const job = schedule.scheduleJob(rule, async function(){
        console.log('IotStatus 위험데이터 있는지 1분마다 스케줄 확인');

        let initResult = await ScheduleJobManager.initWithConnPool(pool);

        if(!initResult.success) {
            //init failed;
            console.log('init failed!');
        } else {
            // 2. 1분마다의 알림 컬럼별 Status 확인하기
            const oneMinuteQuery = 'SELECT count(*) as DangerCount, IotNum, AlarmVoltage, AlarmElectric, AlarmLeakage, AlarmArc, AlarmTemperature FROM CautionIot WHERE DATE between date_add(?, interval -2 minute) and ? GROUP BY IotNum, AlarmVoltage, AlarmElectric, AlarmLeakage, AlarmArc, AlarmTemperature';
            const oneMinuteResult = await db.queryParam_Parse(oneMinuteQuery, [moment().format('YYYY-MM-DD hh:mm:ss'), moment().format('YYYY-MM-DD hh:mm:ss')]);
            console.log(oneMinuteResult[0]);            
            // 3. 각 5가지의 알림컬럼별의 Status 별 비교
            const querylen = oneMinuteResult.length;
            
            for(var i = 0; i < querylen; i++) {
                if(oneMinuteResult[i].DangerCount >= 5) {
                    const insertQuery = 'INSERT INTO DangerIot (IotNum, Date, AlarmVoltage, AlarmElectric, AlarmLeakage, AlarmArc, AlarmTemperature) VALUES (?,?,?,?,?,?,?)';
                    const insertResult = await db.queryParam_Parse(insertQuery, [oneMinuteResult[i].IotNum, moment().format('YYYY-MM-DD hh:mm:ss'), oneMinuteResult[i].AlarmVoltage, oneMinuteResult[i].AlarmElectric, oneMinuteResult[i].AlarmLeakage, oneMinuteResult[i].AlarmArc, oneMinuteResult[i].AlarmTemperature]);
                    
                    const selectQuery = 'SELECT Phone FROM team_JCIM.user where IotNum = ?';
                    const selectResult = await db.queryParam_Parse(selectQuery, [oneMinuteResult[i].IotNum]);
                    console.log(selectResult)
                    //messageSend.send_message(selectResult[0].Phone, '현재 위험 상태입니다');
                }
            }

        }
    });
}

set();


module.exports = router;

