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
var moment = require('moment');

// now_date = moment().format('YYYY-MM-DD')
new_date = "2021-09-05"
console.log("new_date", new_date)

router.get('/', async (req, res) => {
    
    const selectTodayIotQuery = 'select Date,VoltageAvg from DataOfIotMinute where IotNum = ? and DATE(Date)= ? ORDER BY Date'
    const selectTodayIotResult = await db.queryParam_Parse(selectTodayIotQuery,[req.body.IotNum,req.body.Date ]);
    // req.body.Date
    if(!selectTodayIotResult){
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.DB_ERROR));
    }else{
        console.log(selectTodayIotResult)
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.OVERVIEW_LOOKUP_SUCCESS, selectTodayIotResult));
    }
});

module.exports = router;