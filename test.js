const cryptoJs = require('crypto-js');

const current = (new Date()).valueOf().toString();
const url = "https://talenthandong.site/register?invitation=";
const invitation = cryptoJs.SHA1(current).toString();

console.log(invitation);