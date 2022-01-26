// var express = require('express');
// var router = express.Router();
// const db = require('../../../module/pool');
// const defaultRes = require("../../../module/utils/utils");
// const statusCode = require("../../../module/utils/statusCode");
// const resMessage = require("../../../module/utils/responseMessage");

// router.post('/', async (req, res) => {

//     console.log(req.body);
//     const getUser = "SELECT * FROM user WHERE email=? AND name =? ";
//     const getUserinfo = await db.queryParam_Parse(getUser, [req.body.email, req.body.name]);
  
//     if (!getUserinfo[0]) {
//       res.status(200).send("입력된 정보가 잘못되었습니다.");
//     } else { //쿼리문이 성공했을 때
  
//       //f 추출
//       var random = Math.floor(Math.random() * 10000);
  
//       const getUpdate = "UPDATE user SET password =? WHERE email =? AND name = ?";
//       const getResult = await db.queryParam_Parse(getUpdate, [random, req.body.email, req.body.name]);
  
//       let email = req.body.email;
//       var password = random;
//       console.log(email);
//       console.log(password);
  
  
//       const smtpTransport = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//           user: senderInfo.user,
//           pass: senderInfo.pass
//         }
//       })
      
//       const mailOptions = {
//         from: senderInfo.user,
//         to: email,
//         subject: '안녕하세요. 전력량 예측 서비스 홈페이지입니다.',
//         text: "임시 비밀번호 : " + password
//       };
  
//       await smtpTransport.sendMail(mailOptions, (error, responses) => {
//         if (error) {
//           console.log(error);
//           res.status(200).send("실패");
//         } else {
//           res.status(200).send("성공");
//         }
//         smtpTransport.close();
//       });
//     }
//   });

//   module.exports = router;




"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);