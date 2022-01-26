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

/* 회원가입 api */
router.post('/', async (req, res) => {
    //(1)사용자에게 네가지 값을 받는다.
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const name = req.body.name;
    
    const birth = req.body.birth;
    const address = req.body.address;
    const Iotnum = req.body.Iotnum;

    console.log(email);
    console.log(password);
    console.log(phone);
    console.log(name);
    
    const signupQuery = 'INSERT INTO user (name, email, phone, password, birth, address, Iotnum, salt) VALUES (?,?,?,?,?,?,?,?)'

    //(3) email 중복 없을 시, 회원가입하기
    // if (selectIdResult[0] == null) {
        console.log("일치 없음");
        //(3-1) 비밀번호 암호화 작업
        const buf = await crypto.randomBytes(64);
        const salt = buf.toString('base64');
        const hashedPw = await crypto.pbkdf2(password, salt, 1000, 32, 'SHA512')

        // console.log(hashedPw);
        //(3-2) 암호화된 비밀번호와 함께 INSERT 문 실행
        const signupResult = await db.queryParam_Arr(signupQuery, [name,email,phone,hashedPw.toString('base64'), birth, address, Iotnum, salt]);
        // console.log(signupResult);
        
        //(3-3) 결과값에 따른 쿼리문 출력하기
        if (!signupResult) {
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.SIGNUP_FAIL));
        } else { //쿼리문이 성공했을 때

            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SIGNUP_SUCCESS));
        }

});

module.exports = router;

