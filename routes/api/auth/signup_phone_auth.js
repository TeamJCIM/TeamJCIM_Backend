var express = require('express');
var router = express.Router();
const defaultRes = require('../../../module/utils/utils');
const messageSend = require('./send_message');
const randomNum = require('./randomNum');

router.post('/', async (req, res) => {
    var phone = req.body.phone;
    var sendNum = randomNum.authNo(0,9,6);
    messageSend.send_message(phone, sendNum);
    res.status(200).send(defaultRes.successTrue(200, "인증번호 전송 완료", sendNum));
});

module.exports = router;

/*
회원가입 핸드폰 인증
1. 핸드폰 번호를 입력 받는다.
2. 핸드폰 번호로 랜덤 6자리 숫자 발송
3. 인증번호 프론트에게 전달
*/