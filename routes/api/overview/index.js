var express = require('express');
var router = express.Router();

router.use('/', require('./mainPageOverview.js'));

module.exports = router;

