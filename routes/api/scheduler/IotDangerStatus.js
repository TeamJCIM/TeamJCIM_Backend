var express = require('express');
var router = express.Router();
const defaultRes = require('../../../module/utils/utils');
const resMessage = require('../../../module/utils/responseMessage');
const statusCode = require("../../../module/utils/statusCode");
const db = require('../../../module/pool');
var moment = require('moment');
now_date = moment().format('YYYY-MM-DD')

router.get('/:IotNum', async (req, res) => {

    var IotNum = req.params.IotNum;
    // const selectSafeQuery = 'SELECT * FROM DangerIot where IotNum = ? and Date like ?';
    // const selectSafeResult = await db.queryParam_Parse(selectSafeQuery, [IotNum, moment().format('YYYY-MM-DD')+'%']);
    
    // const selectCautionQuery = 'SELECT * FROM CautionIot where IotNum = ? and Date like ?';
    // const selectCautionResult = await db.queryParam_Parse(selectCautionQuery, [IotNum, moment().format('YYYY-MM-DD')+'%']);

    const selectDangerQuery = 'SELECT * FROM DangerIot where IotNum = ? and Date like ?';
    const selectDangetResult = await db.queryParam_Parse(selectDangerQuery, [IotNum, moment().format('YYYY-MM-DD')+'%']);

    
    console.log(selectDangetResult);
    res.status(200).send(defaultRes.successTrue(statusCode.OK, "오늘 들어온 위험데이터", selectDangetResult));
    // if(!selectCautionResult[0]){
    //     // 안전 인 경우 
    //     res.status(200).send(defaultRes.successTrue(200, "해당하는 IoTNum의 Status는 안전합니다."));
    // }
    // else{
    //     const selectDangerQuery = 'SELECT * FROM DangerIot where IotNum = ?';
    //     const selectDangetResult = await db.queryParam_Parse(selectDangerQuery, [IotNum]);
    //     if(!selectDangetResult[0]){
    //         // 주의 인 경우 
    //         res.status(200).send(defaultRes.successTrue(200, "해당하는 IoTNum의 Status는 주의입니다.",selectCautionResult));
    //     }
    //     else{
    //         // 위험 인 경우 
    //         res.status(200).send(defaultRes.successTrue(200, "해당하는 IoTNum의 Status는 위험입니다.",selectDangetResult));            
    //     }
    // }

   
});



module.exports = router;

