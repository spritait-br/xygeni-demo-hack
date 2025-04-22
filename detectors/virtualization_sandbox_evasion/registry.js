_0x2b0035 = _0x343832.promisify(require('child_process').exec)

const { stdout: _0x1e1cbf, _: _0x2e4eae } = await _0x2b0035(
    'powershell -c "Get-Item -Path "HKLM:\\SYSTEM\\ControlSet001\\services\\VBoxMouse"'
)
