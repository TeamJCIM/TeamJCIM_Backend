var express = require('express');
var router = express.Router();

router.use('/predictThisMonth', require('./predictThisMonth.js'));

module.exports = router;

