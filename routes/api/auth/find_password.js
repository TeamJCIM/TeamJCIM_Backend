const db = require('../../../module/pool');
const mailSend = require('./mail_transport');
const randomNum = require('./randomNum');
const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage')
const messageSend = require('./send_message');
const crypto = require('crypto-promise');
var express = require('express');
var router = express.Router();
        
router.post('/', async (req, res) => { // 입력받은 이메일과 휴대폰 번호를 가진 user가 있는지 확인
    var email = req.body.email;
    var phone = req.body.phone;

    // 입력받은 이메일과 휴대폰 번호를 가진 user가 존재하는지 확인
    const selectQuery = 'SELECT * FROM user WHERE email = ? AND phone = ?'
    const selectResult = await db.queryParam_Parse(selectQuery, [email, phone]);
    console.log(selectResult[0]);
    if (selectResult[0] == null) {
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.ID_NO));
    } else {
        var sendNum = randomNum.authNo(0,9,6);
        messageSend.send_message(phone, sendNum);
        res.status(200).send(defaultRes.successTrue(200, "인증번호 전송 완료", sendNum));
    }
});

router.post('/phone_auth', async (req, res) => {
    var email = req.body.email;
    // 임시 비밀번호 생성(랜덤 문자열)
    var new_pwd = Math.random().toString(36).substr(2,11);
    // 임시 비밀번호를 사용자 email로 전송한다.
    mailSend.sendMail(email, new_pwd);
    // 비밀번호 업데이트한다.
    const buf = await crypto.randomBytes(64);
    const salt = buf.toString('base64');
    const hashedPw = await crypto.pbkdf2(new_pwd, salt, 1000, 32, 'SHA512');
    const changeQuery = 'UPDATE user SET password = ?, salt = ? WHERE email= ?';
    const changeResult = await db.queryParam_Arr(changeQuery, [hashedPw.toString('base64'), salt, email]);
    res.status(200).send(defaultRes.successTrue(200, "임시 비밀번호 이메일 전송 완료"));
});

module.exports = router;

/*비밀번호 찾기 
1. 이메일, 휴대폰 번호 입력
    - 입력받은 이메일을 가진 사람이 있는지 확인
2. DB에 있는 휴대폰 번호와 입력한 휴대폰 번호가 동일한지 확인
3. 동일하다면 랜덤 6자리 숫자를 휴대폰 번호로 전송한다.

4. 임시비밀번호 발급 :  이메일에 랜덤문자열을 보낸다. (인증이 되었을 경우)
5. 임시비번으로, 비밀번호 업데이트
    - 암호화 진행 한뒤 업데이트
*/

