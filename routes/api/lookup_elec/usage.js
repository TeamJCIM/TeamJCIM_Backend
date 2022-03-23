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
// console.log(now_date)
// console.log(now_month)
// console.log(now_year)

router.get('/:IotNum', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    
    // 당일사용량
    const selectTodayQuery = 'SELECT Date, IotData FROM DataOfIotDay WHERE IotNum = ? and Date = ?'
    const selectTodayResult = await db.queryParam_Parse(selectTodayQuery,[req.params.IotNum, '2021-09-06']);
    // 당월/전월 사용량
    const selectMonthQuery = 'SELECT Date,IotData  FROM DataOfIotDay WHERE IotNum = ? and Month = ?'
    const selectThismonthResult = await db.queryParam_Parse(selectMonthQuery, [req.params.IotNum, 9]);
    last_month = now_month -1
    const selectLastmonthResult = await db.queryParam_Parse(selectMonthQuery, [req.params.IotNum, 8]);
    // 연간사용량
    const selectYearQuery = 'SELECT Month,IotData FROM DataOfIotMonth WHERE IotNum = ? and Year = ?'
    const selectYearResult = await db.queryParam_Parse(selectYearQuery, [req.params.IotNum, 2021]);

    if(!(selectTodayResult || selectYearResult || selectThismonthResult || selectLastmonthResult)){
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.DB_ERROR));
    }else{
        console.log(selectTodayResult)
        // selectTodayResult,selectThismonthResult,selectLastmonthResult,
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.LOOKUP_SUCCESS, [selectTodayResult,selectThismonthResult,selectLastmonthResult, selectYearResult]));
    }
});


module.exports = router;