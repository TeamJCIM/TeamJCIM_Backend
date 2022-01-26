const nodemailer = require('nodemailer');
const mailConfig = require("../../../config/mailConfig");

module.exports = {
    sendMail: (email, pwd) => {
        try {
          let message = {
            from: 'so02051@naver.com',
            to: email,
            subject: '새 비밀번호입니다.',
            html: `<p> ${pwd} </p>`
          }
          let transporter = nodemailer.createTransport(mailConfig)
          transporter.sendMail(message)
        } catch (error) {
          console.log(error)
        }
    }
};
