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

/* Iot 중복 확인 api */
router.post('/', async (req, res) => {
    //(1)사용자에게 iot 값을 받는다.
    const Iotnum = req.body.Iotnum;
    console.log(Iotnum);

    //(2) Iotnum 중복 검사
    const selectIdQuery = 'SELECT * FROM user WHERE Iotnum = ?'
    const selectIdResult = await db.queryParam_Parse(selectIdQuery, Iotnum);
    console.log(selectIdQuery);
    console.log(selectIdResult);


    //(3) Iotnum 중복 없을 시
    if (selectIdResult[0] == null) {
        console.log("일치 없음");
        res.status(200).send(defaultRes.successTrue(200, "중복되는 Iot num이 없습니다."));
    } else {
        console.log("이미 존재");
        res.status(200).send(defaultRes.successFalse(statusCode.OK, "중복되는 Iot num이 있습니다."));
    }
});

module.exports = router;

