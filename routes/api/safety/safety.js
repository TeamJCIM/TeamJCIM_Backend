var express = require('express');
var router = express.Router();
const defaultRes = require('../../../module/utils/utils');
const resMessage = require('../../../module/utils/responseMessage');
const statusCode = require("../../../module/utils/statusCode");
const db = require('../../../module/pool');

router.get('/:IotNum', async (req, res) => {
    var IotNum = req.params.IotNum;
    var Year = req.params.Year;

    // 현재 iot 상태 기록
    var IotNum = req.params.IotNum;
    const selectUserQuery2 = 'SELECT Temperature, AlarmVoltage, AlarmElectric, AlarmLeakage, AlarmArc, AlarmTemperature FROM DataOfIotMinute WHERE IotNum = ?';
    const selectUserResult2 = await db.queryParam_Parse(selectUserQuery2, IotNum);

    if(!(selectUserQuery2[0])){ // IotNum에 해당하는 컬럼이 없는 겨우
        res.status(200).send(defaultRes.successFalse(200, "해당하는 IoTNum의 안전 데이터가 존재하지 않습니다."));
    } else { // IotNum에 해당하는 컬럼이 있는 경우
       res.status(200).send(defaultRes.successTrue(statusCode.OK, "안전 데이터 존재", [selectUserResult2[selectUserResult2.length-1]]));
    }    
});

module.exports = router;
