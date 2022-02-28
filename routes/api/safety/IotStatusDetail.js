var express = require('express');
var router = express.Router();
const defaultRes = require('../../../module/utils/utils');
const resMessage = require('../../../module/utils/responseMessage');
const statusCode = require("../../../module/utils/statusCode");
const db = require('../../../module/pool');

router.get('/', async (req, res) => {
    var IotNum = req.body.IotNum;
    const selectUserQuery = 'SELECT IotNum, Temperature, AlarmVoltage, AlarmElectric, AlarmLeakage, AlarmArc, AlarmTemperature FROM DataOfIotMinute WHERE IotNum = ?';
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, IotNum);

    if(selectUserResult[0] == null){ // IotNum에 해당하는 컬럼이 없는 겨우
        res.status(200).send(defaultRes.successFalse(200, "해당하는 IoTNum의 안전 데이터가 존재하지 않습니다."));
    } else { // IotNum에 해당하는 컬럼이 있는 경우
        console.log(selectUserResult);
        res.status(200).send(defaultRes.successTrue(statusCode.OK, "안전 데이터 존재", selectUserResult[selectUserResult.length-1]));
    }    
});

module.exports = router;
