
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

    iotnum = req.params.IotNum;

    const selectpredictdayQuery = 'SELECT PredictData, Date FROM team_JCIM.AiDate where IotNum = ?';
    const selectpredictdayResult = await db.queryParam_Parse(selectpredictdayQuery, [iotnum]);

    const selectpredictmonthQuery = 'SELECT PredictData FROM team_JCIM.AiMonth where IotNum = ? and Month = 3';
    const selectpredictmonthResult = await db.queryParam_Parse(selectpredictmonthQuery, [iotnum]);

    const selectUserQuery = 'SELECT IotData, Date FROM DataOfIotDay WHERE IotNum = ? AND Month = 3';
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, [iotnum]);
    if(selectpredictdayResult[0] && selectpredictmonthResult[0]) {
        res.status(200).send(defaultRes.successTrue(statusCode.OK, ["30일 예측 데이터, 달의 합 예측 데이터, 실제 30일 데이터",selectpredictdayResult, selectpredictmonthResult,selectUserResult]));
    }else {
        res.status(200).send(defaultRes.successFalse(200, "해당하는 IoTNum의 예측 데이터가 존재하지 않습니다."));
    }

});

module.exports = router;