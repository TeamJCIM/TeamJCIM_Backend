var express = require('express');
var router = express.Router();

router.use('/IotDangerStatus', require('./IotDangerStatus.js'));
router.use('/IotStatusSchduler', require('./IotStatusSchduler.js'));


module.exports = router;