var express = require('express');
var router = express.Router();
const defaultRes = require('../../../module/utils/utils');
const resMessage = require('../../../module/utils/responseMessage');
const statusCode = require("../../../module/utils/statusCode");
const db = require('../../../module/pool');

router.get('/', async (req, res) => {
    var IotNum = req.body.IotNum;
    var Year = req.body.Year;

    const selectAIQuery = 'SELECT PredictData, Month FROM AiMonth WHERE IotNum = ? AND Year = ?';
    const selectAIResult = await db.queryParam_Parse(selectAIQuery, [IotNum,Year]);
    const selectUserQuery = 'SELECT IotData, Month FROM DataOfIotMonth WHERE IotNum = ? AND Year = ?';
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, [IotNum,Year]);

    if((selectAIResult[0] == null) || (selectUserResult[0] == null)){ // IotNum에 해당하는 컬럼이 없는 겨우
        res.status(200).send(defaultRes.successFalse(200, "해당하는 IoTNum의 데이터가 존재하지 않습니다."));
    } else { // IotNum에 해당하는 컬럼이 있는 경우
        res.status(200).send(defaultRes.successTrue(statusCode.OK, "예측값과 실제 사용값 비교값 전달 성공", [selectAIResult, selectUserResult]));
    }    
});

module.exports = router;
