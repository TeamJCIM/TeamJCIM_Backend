var express = require('express');
var router = express.Router();
const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage')
const db = require('../../../module/pool');

const jwtUtils = require('../../../module/jwt');


/*
사용자의 accesstoken이 만료되었을 때,
refreshToken을 비교해서,refresh가 있다면 새로운 accesstoken을 만들어야 한다.
*/ 

router.get('/', async (req, res) => {
    const refreshToken = req.headers.refreshtoken;
    const selectUserQuery = 'SELECT * FROM user WHERE refreshToken = ?';
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, refreshToken);
    if (!selectUserResult) {// DB오류
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    } else {
        if (selectUserResult[0] == null) {
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.NOT_CORRECT_REFRESH_TOKEN_USER));
        } else {
            //refreshToken이 존재한다면 새 accesstoken 생성하고 프론트에게 전달한다.
            
            const newAccessToken = jwtUtils.refresh(selectUserResult[0]);
            console.log("newAccessToken: ", newAccessToken);
            //다시 accesstoken 을 저장
            const updateTokenQuery = 'UPDATE user SET accessToken = ? WHERE refreshToken = ?';
            const updateTokenResult = await db.queryParam_Parse(updateTokenQuery, [newAccessToken, refreshToken]);
            if(!updateTokenResult){
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
            }
            else{
                console.log("newAccessToken: ", newAccessToken);
                res.status(statusCode.OK).send(defaultRes.successTrue(statusCode.OK, resMessage.REFRESH_TOKEN, newAccessToken));
            }
        } 

    }
});

module.exports = router;
