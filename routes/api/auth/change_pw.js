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

/* 비밀번호 변경 api */
router.post('/:User_Id', async (req, res) => {
    oldpw = req.body.OldPassword
    changepw = req.body.NewPassword
    /* 1. Salt 값 가져오기 */
    const GetSaltQuery = 'SELECT Salt FROM team_JCIM.user where UserId = ?'
    const GetSaltResult = await db.queryParam_Arr(GetSaltQuery, [req.params.User_Id]);

    if(!GetSaltResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "비밀번호 입력 오류"));
        
    }
    else{
        /* 2. DB비번과 비교하기 */
        var salt1 = GetSaltResult[0]['Salt']
        const hashedPw = await crypto.pbkdf2(oldpw, salt1, 1000, 32, 'SHA512')

        const GetPasswordQuery = 'SELECT Password FROM team_JCIM.user where UserId = ?'
        const GetPasswordResult = await db.queryParam_Arr(GetPasswordQuery, [req.params.User_Id]);
        
        var db_password = GetPasswordResult[0]['Password']

        // console.log('db : ',db_password)
        // console.log('hash : ',hashedPw)
        if(db_password == hashedPw.toString('base64')){

            /* 3. 비밀번호 변경하기 */
            const buf = await crypto.randomBytes(64);
            const salt = buf.toString('base64');
            const hashedPw_new = await crypto.pbkdf2(changepw, salt, 1000, 32, 'SHA512');


            const ChangePwQuery = 'Update team_JCIM.user set  Password = ? where UserId = ?'
            const ChangePwResult = await db.queryParam_Arr(ChangePwQuery, [hashedPw_new, req.params.User_Id]);
        
            if (!ChangePwResult) {
                    res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "비밀번호 변경 실패"));
                } else { //쿼리문이 성공했을 때
                    res.status(200).send(defaultRes.successTrue(statusCode.OK, "비밀번호 변경 성공"));
                }

        }
        else{

            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "입력한 비밀번호가 일치하지 않습니다."));
        }
        
        
        
        


    }

});

module.exports = router;

