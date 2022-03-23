var express = require('express');
var router = express.Router();
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

const monthLength = require("../../../module/utils/monthLength");
const moment = require('moment');

router.get('/:IotNum/:Date', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    
    // 전력 조회
    const selectUsageElecQuery = 'SELECT IotData FROM DataOfIotDay WHERE IotNum = ? and Date = ?'
    const selectUsageElecResult = await db.queryParam_Parse(selectUsageElecQuery,[req.params.IotNum, req.params.Date]);

    // 전력 예측
    var now_month = parseInt(moment().format('MM'));
    var now_year = parseInt(moment().format('YYYY'));
    var IotNum = req.params.IotNum;
    var predictElec = 2000;

    const selectUserQuery = 'SELECT Date, IoTData FROM DataOfIotDay WHERE IotNum = ? AND YEAR(Date) = ? AND MONTH(Date) = ?';
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, [IotNum, now_year, now_month]);

    // 안전 지수
    const selectSafeUserQuery = 'SELECT AlarmVoltage, AlarmElectric, AlarmLeakage, AlarmArc, AlarmTemperature FROM DataOfIotMinute WHERE IotNum = ?';
    const selectSafeUserResult = await db.queryParam_Parse(selectSafeUserQuery, IotNum);

    // 하루 사용량
    const selectTodayIotQuery = 'select DATE(Date),VoltageAvg from DataOfIotMinute where IotNum = ? and DATE(Date)= ? ORDER BY Date'
    const selectTodayIotResult = await db.queryParam_Parse(selectTodayIotQuery,[req.params.IotNum,req.params.Date]);

    if(!(selectUsageElecResult || selectUserResult || selectSafeUserResult || selectTodayIotResult)){
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.DB_ERROR));
    } else{
        var sum = 0;
        const querylen = selectUserResult.length;
        const shortagelen = monthLength[now_month] - querylen;
        var userAvg;
        var count = 1;

        for(var i = 0; i < querylen; i++) {
            sum += selectUserResult[i].IoTData;
        }
        for(var i = 0; i < shortagelen; i++) {
            sum += predictElec;
        }
        userAvg = sum / monthLength[now_month];

        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.OVERVIEW_LOOKUP_SUCCESS, [selectUsageElecResult, "전력예측값 : " + userAvg, selectSafeUserResult[selectSafeUserResult.length-1], selectTodayIotResult]));
    }
});

module.exports = router;