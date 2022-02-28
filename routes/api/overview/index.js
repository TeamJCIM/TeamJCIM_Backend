var express = require('express');
var router = express.Router();

router.use('/lookup', require('./lookup.js'));


module.exports = router;