const CryptoJS = require('crypto-js');
const axios = require('axios');
const mgConfig = require("../../../config/messageConfig");

module.exports = {
  send_message: (phone, message) => {
    var resultCode = 404;
    const date = Date.now().toString();
    const method = "POST";
    const space = " ";
    const newLine = "\n";
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${mgConfig.uri}/messages`;
    const url2 = `/sms/v2/services/${mgConfig.uri}/messages`;
    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, mgConfig.secretKey);
    hmac.update(method);
    hmac.update(space);
    hmac.update(url2);
    hmac.update(newLine);
    hmac.update(date);
    hmac.update(newLine);
    hmac.update(mgConfig.accessKey);
    const hash = hmac.finalize();
    const signature = hash.toString(CryptoJS.enc.Base64);
    axios({
      method:method,
      url: url,
      headers: {
          "Contenc-type": "application/json; charset=utf-8",
          "x-ncp-iam-access-key": mgConfig.accessKey,
          "x-ncp-apigw-timestamp": date,
          "x-ncp-apigw-signature-v2": signature,
      },
      // request는 body였지만 axios는 data다
      data: {
          type: "SMS",
          countryCode: "82",
          from: mgConfig.from,
          content: message,
          messages: [
          // 신청자의 전화번호
              { to: phone },],
      },
    }).then(res => {
        console.log(res.data);
    })
      .catch(err => {
        console.log(err);
      })
    return resultCode;
  }
}

  