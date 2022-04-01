var express = require('express');
var router = express.Router();

router.use('/predictThisMonth', require('./predictThisMonth.js'));
router.use('/predictThisMonth_test', require('./predictThisMonth_test.js'));

module.exports = router;

