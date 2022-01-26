var express = require('express');
var router = express.Router();
const defaultRes = require('../../../module/utils/utils');
const db = require('../../../module/pool');

router.post('/', async (req, res) => {
    var email = req.body.email;
    const selectUserQuery = 'SELECT * FROM user WHERE email = ?';
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, email);

    if(selectUserResult[0] == null){ // 중복되는 email이 없는 경우
        res.status(200).send(defaultRes.successTrue(200, "중복되는 email이 없습니다."));
    } else { // 중복되는 email이 있는 경우
        res.status(200).send(defaultRes.successFalse(200, "중복되는 email이 있습니다."));
    }
    
});

module.exports = router;

/*
email 중복 검사
1. email을 입력받는다.
2. DB에서 해당 email을 가진 user가 있는지 확인
3. 있다면 false, 없다면 true 반환
*/