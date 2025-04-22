const { Buffer } = require('node:buffer');

var decodedData = String(Buffer.from('MTY5LjI1NC4xNjkuMjU0', 'base64'));

eval(decodedData)

// LGV var modeDecodedData = dtoa('MTY5LjI1NC4xNjkuMjU0');

// LGV eval(modeDecodedData)