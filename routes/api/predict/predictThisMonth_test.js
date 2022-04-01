
const express = require('express');
const router = express.Router();
const defaultRes = require('../../../module/utils/utils');
const resMessage = require('../../../module/utils/responseMessage');
const statusCode = require("../../../module/utils/statusCode");
const monthLength = require("../../../module/utils/monthLength");
const db = require('../../../module/pool');
const moment = require('moment');
const spawn = require('child_process').spawn;

router.get('/:IotNum', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");

    var now_year = 2021;
    
    const ExistData = 'SELECT IotData FROM team_JCIM.DataOfIotMonth WHERE Year = ?';
    const ExistDataResult = await db.queryParam_Parse(ExistData, [now_year]);  

    const ExistPredict = 'SELECT IotData FROM team_JCIM.DataOfIotMonth WHERE Year = ?';
    const ExistPredictResult = await db.queryParam_Parse(ExistPredict, [now_year]);  

    var now_month = 12;  // test를 위한 월 오늘이 12월5일이라고 생각.
    var IotNum = req.params.IotNum;
    var predictElec = 2000 * 24;

    const selectUserQuery = 'SELECT IoTData FROM DataOfIotDay WHERE IotNum = ? AND YEAR(Date) = ? AND MONTH(Date) = ?';
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, [IotNum, now_year, now_month]);


    if(selectUserResult[0] == null || ExistDataResult[0] == null || ExistPredictResult[0] == null){ // IotNum에 해당하는 컬럼이 없는 겨우
        res.status(200).send(defaultRes.successFalse(200, "해당하는 IoTNum의 안전 데이터가 존재하지 않습니다."));
    } else { // IotNum에 해당하는 컬럼이 있는 경우
        var sum = 0;
        var sumThisMonth;
        const querylen = selectUserResult.length;
        const shortagelen = monthLength[now_month] - querylen;
        var userAvg;

        for(var i = 0; i < querylen; i++) {
            sum += selectUserResult[i].IoTData;
        }
        sumThisMonth = sum;

        for(var i = 0; i < shortagelen; i++) {
            sum += predictElec;
        }
        userAvg = sum / monthLength[now_month];

        res.status(200).send(defaultRes.successTrue(statusCode.OK, ["이번년도 예측 전력량, 이번년도 실제 전력량, 이번달 예측 전력량, 이번달 실제 전력 사용량",ExistPredictResult, ExistDataResult,userAvg, sumThisMonth]));
    }    
});

module.exports = router;