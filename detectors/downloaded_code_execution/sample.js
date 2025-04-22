const axios = require('axios');

axios.get('https://some.domain.xy')
    .then(response => {
        var toEval = response.data; // source
        eval(toEval); // sink
    })
    .catch(error => {
        console.error(error);
    });

var obj = {
    loadSyncJS: function(url) {
        let xhrObject = new window.ActiveXObject('MsXml2.XmlHttp'); // IE
        if (xhrObject) {
            xhrObject.open('GET', url, false);
            xhrObject.send(null);
            if (xhrObject.status === 200) {
                // noinspection DynamicallyGeneratedCodeJS
                eval(xhrObject.responseText);
            }
        } else {
            Coon.log.error('unknown browser type, can\'t get XmlHttp object');
        }
    }
}