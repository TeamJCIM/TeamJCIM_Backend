var express = require('express');
var router = express.Router();

const crypto = require('crypto-promise');

const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage')
const db = require('../../../module/pool');

const jwtUtils = require('../../../module/jwt');


//로그인 api
router.post('/', async (req, res) => {
    email = req.body.email;
    password = req.body.password

    const selectUserQuery = 'SELECT * FROM user WHERE Email = ?'
    //들어온 email에 따라 모든 값 select
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, email);
    console.log(selectUserResult);
    //email 확인
    if (selectUserResult[0] == null) {
        // 아이디가 존재하지 않으면
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.EMAIL_NOT_FOUND));
    } else {
        const salt = selectUserResult[0].Salt;
        const hashedEnterPw = await crypto.pbkdf2(password, salt, 1000, 32, 'SHA512')
        const dbPw = selectUserResult[0].Password
        //비밀번호 확인
        if (hashedEnterPw.toString('base64') == dbPw) {
            //토큰 발행
            const tokens = jwtUtils.sign(selectUserResult[0]);
            const accessToken = tokens.token;
            const refreshToken = tokens.refreshToken;
            const TokenUpdateQuery = "UPDATE user SET AccessToken = ?, RefreshToken = ? WHERE Email= ?";
            const TokenUpdateResult = await db.queryParam_Parse(TokenUpdateQuery, [accessToken, refreshToken, email]);
            if (!TokenUpdateResult) {
                res.status(200).send(defaultRes.successTrue(statusCode.DB_ERROR, "refreshtoken DB등록 오류 "));
            } else {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SIGNIN_SUCCESS, {
                    tokens
                }));
            }
        } else {
            //비밀번호가 일치하지 않음
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.NOT_CORRECT_USERINFO));
        }
    }
});

module.exports = router;