
const express = require('express');
const router = express.Router();
const defaultRes = require('../../../module/utils/utils');
const resMessage = require('../../../module/utils/responseMessage');
const statusCode = require("../../../module/utils/statusCode");
const monthLength = require("../../../module/utils/monthLength");
const db = require('../../../module/pool');
const moment = require('moment');
const spawn = require('child_process').spawn;

const { PythonShell } = require("python-shell");


router.get('/:IotNum', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");

    var predictData = []

    let options = {
        scriptPath: "./",
        args: [req.params.IotNum]
    };

    PythonShell.run("./routes/api/predict/my_python.py", options, function(err, data) {
        if (err) throw err;

        predictData = data[0].split(',');
        // console.log(data);
        // console.log(predictData);
        // console.log(predictData[0]);
        var prelen = predictData.length
        for(var i = 0; i < prelen; i++){
            predictData[i] = predictData[i].replace(/[^0-9.]/g, "")
        }

        res.status(200).send(defaultRes.successTrue(statusCode.OK, "예측 전력량", predictData));
    });

  
});

module.exports = router;