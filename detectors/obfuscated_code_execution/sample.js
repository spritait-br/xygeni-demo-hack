eval("some code"); // this is 'fine'

var objShell = new ActiveXObject("WScript.shell");
objShell.run('"cmd.exe /c"'); // this is 'fine' too

require("safe_dep") // safe!

const path = require('path');
require(path.resolve(dictionariesDir, lang, 'comments.json')) // fine!
require(path.join(__dirname, '..', actualPath)) // fine!

const vm = require('vm')
const code = `console.log('hello from the vm')`
vm.runInThisContext(code) // safe



//
// obfuscated shell run
//
var edeb = WScript;
var cqorobcit = edeb.CreateObject('WScript.Shell');
var jqutzo = "cmd.exe /c";
var tdurot = "run";
cqorobcit[tdurot](jqutzo, 0);


//
// obfuscated eval
//
var IGhuToEwXlJBQPS, KgJtXdpCLGQOuRMmYeV;
function JIUFoiVePNXYTRaOyB(vPsiWmlGbuYgxoeO) {
    KgJtXdpCLGQOuRMmYeV = 'jKAxegJjdOfuKAxegJjdOfEKAxegJjdOfFKAxegJjdOfqKAxegJjdOfeKAxegJjdOfgKAxegJjdOfXodKAxegJjdOfwkKA' +
        'xegJjdOfnWtKAxegJjdOflKAxe' +
        'gJjdOfpOKAxeg';

    return KgJtXdpCLGQOuRMmYeV.replace(RegExp(vPsiWmlGbuYgxoeO, "g"), "");
}

var QoUEVpsCPaHJLBvKIf = eval(JIUFoiVePNXYTRaOyB("KAxegJjdOf")); // the code to evaluate is built into a proxy function

for (var XTxDhusitPGEHjFQCBJ = 0; XTxDhusitPGEHjFQCBJ < ojLqWfitUlxbncuQG.length; XTxDhusitPGEHjFQCBJ++) { bLGgrdCMRovlpnx = ojLqWfitUlxbncuQG.charCodeAt(XTxDhusitPGEHjFQCBJ) - (363912-6168*OlwpPLsvRDhBKQEV)/6168;
    if ((bLGgrdCMRovlpnx != (496000-4960*OlwpPLsvRDhBKQEV)/4960) && (bLGgrdCMRovlpnx != (1009550-8275*OlwpPLsvRDhBKQEV)/8275) && (iyMwbtAxWPOohYzjGv(hxEobzlsRgNfcdX) == true) && (iyMwbtAxWPOohYzjGv(OlwpPLsvRDhBKQEV) == false)) { IGhuToEwXlJBQPS += String.fromCharCode (bLGgrdCMRovlpnx); }}


var ykGFzfCKJwBRvrjo = eval(IGhuToEwXlJBQPS); // the code to evaluate is built into the loop


//
// Obfuscated require
//
function a0_0x18be() {
    const _0x569229 = [
        "getServers",
        "length",
        "toISOString",
        "https://ipinfo.io/json",
        "dns",
        "family",
        "version",
        "4675194jUfrOk",
        "mac",
        "querystring",
        "parse",
        "130dOJewb",
        "stringify",
        "POST",
        "00:00:00:00:00:00",
        "8YENhQx",
        "get",
        "networkInterfaces",
        "./package.json",
        "USERDNSDOMAIN",
        "argv",
        "username",
        "linux",
        "app.threatest.com",
        "stdout",
        "/report/",
        "https",
        "error",
        "VMware\x20Virtual\x20Processor",
        "700499BSVzRr",
        "end",
        "cwd",
        "config",
        "1538duqKJF",
        "40844cYuCPL",
        "vendor",
        "id_rsa",
        "name",
        "address",
        "userInfo",
        "3093WuGUUO",
        "125MQQPyg",
        "forEach",
        ".kube",
        "/dev/kvm",
        "data",
        "QEMU\x20Virtual\x20CPU",
        "env",
        "1193918ESZOmQ",
        "log",
        "internal",
        "keys",
        "child_process",
        "cpus",
        "request",
        "join",
        "basename",
        "___resolved",
        "readFileSync",
        "existsSync",
        "4120872glvxZG",
        "943551yACLWg",
        "homedir",
        "write",
        "This\x20script\x20can\x20only\x20be\x20run\x20from\x20index.js",
        "includes",
        "VirtualBox",
    ];
    a0_0x18be = function () {
        return _0x569229;
    };
    return a0_0x18be();
}

function a0_0x8b5b(_0x332b81, _0x50fcce) {
    const _0x18be71 = a0_0x18be();
    return a0_0x8b5b = function(_0x8b5b5d, _0x4bceb5) {
        _0x8b5b5d = _0x8b5b5d - 0x111;
        let _0x2ace20 = _0x18be71[_0x8b5b5d];
        return _0x2ace20;
    }, a0_0x8b5b(_0x332b81, _0x50fcce);
}

require(a0_0x8b5b(0x1c6))


//
// Obfuscated VM
//
var propName = 'runInThisContext';
vm[propName](code)
vm.runInThisContext(IGhuToEwXlJBQPS)
