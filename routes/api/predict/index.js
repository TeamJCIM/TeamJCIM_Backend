var express = require('express');
var router = express.Router();

router.use('/predictThisMonth', require('./predictThisMonth.js'));
router.use('/predictThisMonth_test', require('./predictThisMonth_test.js'));
router.use('/predictNextMonth', require('./predictNextMonth.js'));
router.use('/predictNextMonth_tmp', require('./predictNextMonth_tmp.js'));

module.exports = router;

