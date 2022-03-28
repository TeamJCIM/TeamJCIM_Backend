const db = require('../../../module/pool');
const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage')
var express = require('express');
const { Iot } = require('aws-sdk');
var router = express.Router();
        
router.post('/', async (req, res) => {
    

    const name = req.body.Name;
    const phone = req.body.Phone;
    const email = req.body.Email;
    const location = req.body.Location;
    const Iotnum = req.body.IotNum;
    const UserId = req.body.UserId;


    const changeQuery = 'UPDATE user SET  Name = ?, Phone = ?, Email = ?, Location = ?, IotNum = ? WHERE UserId= ?';
    const changeResult = await db.queryParam_Arr(changeQuery, [name, phone, email, location, Iotnum, UserId]);
    res.status(200).send(defaultRes.successTrue(200, "회원정보 수정 완료"));
});

module.exports = router;