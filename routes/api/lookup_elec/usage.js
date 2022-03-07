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
now_date = moment().format('YYYY-MM-DD')
now_month = moment().format('MM')
now_year = moment().format('YYYY')
console.log(now_date)
console.log(now_month)
console.log(now_year)

router.get('/', async (req, res) => {
    // 당일사용량
    const selectTodayQuery = 'SELECT Date, IotData FROM DataOfIotDay WHERE IotNum = ? and Date = ?'
    const selectTodayResult = await db.queryParam_Parse(selectTodayQuery,[req.body.IotNum, now_date]);
    // 당월/전월 사용량
    const selectMonthQuery = 'SELECT Date,IotData  FROM DataOfIotDay WHERE IotNum = ? and Month = ?'
    const selectThismonthResult = await db.queryParam_Parse(selectMonthQuery, [req.body.IotNum, now_month]);
    last_month = now_month -1
    const selectLastmonthResult = await db.queryParam_Parse(selectMonthQuery, [req.body.IotNum, last_month]);
    // 연간사용량
    const selectYearQuery = 'SELECT Month,IotData FROM DataOfIotMonth WHERE IotNum = ? and Year = ?'
    const selectYearResult = await db.queryParam_Parse(selectYearQuery, [req.body.IotNum, now_year]);

    if(!(selectTodayResult || selectYearResult || selectThismonthResult || selectLastmonthResult)){
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.DB_ERROR));
    }else{
        console.log(selectTodayResult)
        // selectTodayResult,selectThismonthResult,selectLastmonthResult,
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.LOOKUP_SUCCESS, [selectYearResult]));
    }
});


module.exports = router;