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

/* 이메일찾기 api */
router.post('/', async (req, res) => {
    //(1)사용자에게 두가지 값을 받는다.
    const phone = req.body.phone;
    const name = req.body.name;
    console.log(phone);
    console.log(name);

    //(2) 받은 값에 따라 이메일 유무 확인
    const selectIdQuery = 'SELECT email FROM user WHERE phone = ? AND name = ?'
    const selectIdResult = await db.queryParam_Parse(selectIdQuery, [phone, name]);
    console.log(selectIdQuery);
    console.log(selectIdResult);
    console.log(selectIdResult[0]);


    var resResult ={

        success : 0,
        message : "",
        email : ""
    }

    if(!selectIdResult){
        res.status(200).send("DB 오류");
    }
    //(3-3) 결과값에 따른 쿼리문 출력하기
    else{if (!selectIdResult[0]) {
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.EMAIL_NOT_FOUND));
        } else { //쿼리문이 성공했을 때
            // res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.USER_SELECTED));
            resResult.success=1;
            resResult.message="이메일을 찾았습니다";
            resResult.email=selectIdResult[0];
            res.status(200).send(resResult);
        }
    }
});

module.exports = router;

