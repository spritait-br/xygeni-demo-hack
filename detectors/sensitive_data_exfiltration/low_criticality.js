const http = require('https');

req = http.request({
    host: 'some.domain.net',
    path: '/',
    method: 'POST'
});

var os = require("os");
var data = JSON.stringify(os.freemem());
req.write(Buffer.from(data).toString('base64'));
req.end();
