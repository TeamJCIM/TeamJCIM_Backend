const express = require('express');
const router = express.Router();
const defaultRes = require('../../../module/utils/utils');
const resMessage = require('../../../module/utils/responseMessage');
const statusCode = require("../../../module/utils/statusCode");
const monthLength = require("../../../module/utils/monthLength");
const db = require('../../../module/pool');
const moment = require('moment');
const { query } = require('express');

router.get('/', async (req, res) => {
    var now_day = moment().format('DD')
    var now_month = parseInt(moment().format('MM'));
    var now_year = parseInt(moment().format('YYYY'));
    var IotNum = req.body.IotNum;
    var predictElec = 2000;

    const selectUserQuery = 'SELECT Date, IoTData FROM DataOfIotDay WHERE IotNum = ? AND YEAR(Date) = ? AND MONTH(Date) = ?';
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, [IotNum, now_year, now_month]);

    if(selectUserResult[0] == null){ // IotNum에 해당하는 컬럼이 없는 겨우
        res.status(200).send(defaultRes.successFalse(200, "해당하는 IoTNum의 안전 데이터가 존재하지 않습니다."));
    } else { // IotNum에 해당하는 컬럼이 있는 경우
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

        res.status(200).send(defaultRes.successTrue(statusCode.OK, "예측 전력량", userAvg));
    }    
});

module.exports = router;
