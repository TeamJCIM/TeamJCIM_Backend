module.exports = {
    //0~9까지의 난수
    random: (n1, n2) => {
        return 
    },

    //인증번호를 뽑을 난수 입력 n 5이면 5자리
    authNo: (n1, n2, n) => {
        var value = "";
        for(var i=0; i<n; i++){
            var temp = parseInt(Math.random() * (n2 -n1 +1)) + n1;
            value += temp;
        }
        return value;
    }
};