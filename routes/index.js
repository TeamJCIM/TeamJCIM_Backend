var express = require('express');
var router = express.Router();

/* GET home page. */

router.use('/', require('./api/index.js'));

module.exports = router;
