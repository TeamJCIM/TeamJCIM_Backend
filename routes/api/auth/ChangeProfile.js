const db = require('../../../module/pool');
const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage')
var express = require('express');
const { Iot } = require('aws-sdk');
var router = express.Router();
        
router.post('/', async (req, res) => {
    const email = req.body.email;
    const phone = req.body.phone;
    const name = req.body.name;
    const birth = req.body.birth;
    const address = req.body.address;
    const Iotnum = req.body.Iotnum;

    const userid = req.body.userid;

    const changeQuery = 'UPDATE user SET Email = ?, Phone = ?, Name = ?, Birth = ?, Address = ?, IotNum = ? WHERE UserId= ?';
    const changeResult = await db.queryParam_Arr(changeQuery, [email, phone, name, birth, address, Iotnum, userid]);
    res.status(200).send(defaultRes.successTrue(200, "회원정보 수정 완료"));
});

module.exports = router;