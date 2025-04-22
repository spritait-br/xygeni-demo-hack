const childprocess = require('child_process');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const config = require('../config');

function execClear(command) {
    let res;
    try {
        res = childprocess.execSync(command);
    } catch (e) {
        res = "";
    }
    return res.toString("utf-8").replace(/\n/gm, "").replace(/\r/gm, "").replace(/ /gm, "").toLowerCase();
}

function inVm() {
    if (execClear(`powershell -c "Get-WmiObject -Query \\"Select * from Win32_CacheMemory\\""`) == "") {
        return true;
    }

    return false;
}