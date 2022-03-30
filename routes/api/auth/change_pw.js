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

/* 현재 비밀번호 api */
router.get('/get_pw/:User_Id', async (req, res) => {
    
    const GetPwQuery = 'SELECT Password FROM team_JCIM.user where UserId = ?'
    const GetPwResult = await db.queryParam_Arr(GetPwQuery, [req.params.User_Id]);

    if (!GetPwResult) {
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "해당 비밀번호가 없습니다"));
        } else { //쿼리문이 성공했을 때
            res.status(200).send(defaultRes.successTrue(statusCode.OK, "암호화된 비밀번호 입니다", GetPwResult));
        }

});


router.post('/:User_Id', async (req, res) => {
    changepw = req.body.Password

    const buf = await crypto.randomBytes(64);
    const salt = buf.toString('base64');
    const hashedPw = await crypto.pbkdf2(changepw, salt, 1000, 32, 'SHA512')

    const ChangePwQuery = 'Update team_JCIM.user set  Password = ? where UserId = ?'
    const ChangePwResult = await db.queryParam_Arr(ChangePwQuery, [hashedPw, req.params.User_Id]);

    if (!ChangePwResult) {
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "비밀번호 변경 실패"));
        } else { //쿼리문이 성공했을 때
            res.status(200).send(defaultRes.successTrue(statusCode.OK, "비밀번호 변경 성공"));
        }

});

module.exports = router;

