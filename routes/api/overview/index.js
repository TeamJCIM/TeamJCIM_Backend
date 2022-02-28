var express = require('express');
var router = express.Router();

router.use("/IotStatus", require("./IotStatus"));

module.exports = router;
