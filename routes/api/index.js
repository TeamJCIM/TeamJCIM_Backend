var express = require('express');
var router = express.Router();

// router.use('/auth', require('./auth/index'));
router.use('/overview', require('./overview/index'));
router.use('/lookup_elec', require('./lookup_elec/index'));

module.exports = router;