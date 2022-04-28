var express = require('express');
var router = express.Router();
const defaultRes = require('../../../module/utils/utils');
const resMessage = require('../../../module/utils/responseMessage');
const statusCode = require("../../../module/utils/statusCode");
const db = require('../../../module/pool');

router.get('/:IotNum', async (req, res) => {

    var IotNum = req.params.IotNum;


    const selectCautionQuery = 'SELECT * FROM CautionIot where IotNum = ?';
    const selectCautionResult = await db.queryParam_Parse(selectCautionQuery, [IotNum]);

    // console.log(selectCautionResult);

    if(!selectCautionResult[0]){
        // 안전 인 경우 
        res.status(200).send(defaultRes.successFalse(200, "해당하는 IoTNum의 Status는 안전합니다."));
    }
    else{
        const selectDangerQuery = 'SELECT * FROM DangerIot where IotNum = ?';
        const selectDangetResult = await db.queryParam_Parse(selectDangerQuery, [IotNum]);
        if(!selectDangetResult[0]){
            // 주의 인 경우 
            res.status(200).send(defaultRes.successFalse(200, "해당하는 IoTNum의 Status는 주의입니다."));
        }
        else{
            // 위험 인 경우 
            res.status(200).send(defaultRes.successFalse(200, "해당하는 IoTNum의 Status는 위험입니다."));            
        }
    }

   
});



module.exports = router;

