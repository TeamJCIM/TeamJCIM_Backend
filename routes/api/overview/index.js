var express = require('express');
var router = express.Router();

router.use('/lookup', require('./lookup.js'));
router.use("/IotStatus", require("./IotStatus"));
router.use("/todayusage", require("./todayusage"));


module.exports = router;

