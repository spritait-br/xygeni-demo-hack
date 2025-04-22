var cp = require('child_process');

cp.exec('./file.png', function(err, stdout, stderr) { // evidence
    // handle err, stdout, stderr
});

cp.spawn('./file.md', [args], function(err, stdout, stderr) { // evidence
    // handle err, stdout, stderr
});

cp.execFile('./file.ico', [args], function(err, stdout, stderr) { // evidence
    // handle err, stdout, stderr
});

cp.fork('./myJS.txt', function(err, stdout, stderr) { // evidence
    // handle err, stdout, stderr
});

const shell = require('shelljs')

shell.exec('./path_to_your_file.mka') // evidence

var edeb = WScript;
var cqorobcit = edeb.CreateObject('WScript.Shell');
var jqutzo = "cmd.exe /c C:\\demo\\icon.png param1";
var tdurot = "run";
cqorobcit[tdurot](jqutzo, 1); // evidence


var command = "PowerShell -ex Bypass C:\\demo\\icon.png param1";
cqorobcit[tdurot](command, 1); // evidence
