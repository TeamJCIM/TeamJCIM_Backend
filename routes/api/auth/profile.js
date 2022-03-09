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

router.get('/', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    const selectUserQuery = 'SELECT Name, Phone, Email, Location, IotNum FROM user WHERE UserId = ?'
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, req.body.userid);

    if(!selectUserResult){
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.DB_ERROR));
    }else{
        console.log(selectUserResult)
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.USER_SELECTED, selectUserResult));
    }
});

module.exports = router;