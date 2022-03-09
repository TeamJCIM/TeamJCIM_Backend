var express = require('express');
var router = express.Router();

router.use("/IotStatusDetail", require("./IotStatusDetail"));
router.use("/PowerAnalysis", require("./PowerAnalysis"));
router.use("/", require("./safety"));

module.exports = router;
