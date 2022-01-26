var express = require('express');
var router = express.Router();

// 1231 수정
// 1231 github에서 수정

router.use("/signup", require("./signup"));
router.use("/signin", require("./signin"));
router.use("/findId", require("./findId"));
router.use("/refresh", require("./refresh"));
// router.use("/findPw", require("./findPw"));
router.use("/check_duplicate_email", require("./check_duplicate_email"));
router.use("/checkIot", require("./checkIot"));
router.use("/signup_phone_auth", require("./signup_phone_auth"));
router.use("/find_password", require("./find_password"));


module.exports = router;
