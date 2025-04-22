// 12 evidences


var shell = require('shelljs');

shell.echo('Running script'); // never silent

// Copy files to release dir
shell.rm('-rf', 'out/Release');
shell.cp('-R', 'stuff/', 'out/Release');

// Replace macros in each .js file
shell.cd('lib');
shell.ls('*.js').forEach(function (file) {
    shell.sed('-i', 'BUILD_VERSION', 'v0.1.2', file);
    shell.sed('-i', /^.*REMOVE_THIS_LINE.*$/, '', file);
    shell.sed('-i', /.*REPLACE_LINE_WITH_MACRO.*\n/, shell.cat('macro.js'), file);
});
shell.cd('..');

// Run external tool synchronously
if (shell.exec('git commit -am "Auto-commit"').code !== 0) {
    shell.echo('Error: Git commit failed');
    shell.exit(1);
}

var version = shell.exec('node --version', {silent:true}).stdout; // this is silent
var child = shell.exec('some_long_running_process', {async:true}); // this is not silent!

shell.grep('foo', 'file1.txt', 'file2.txt').sed(/o/g, 'a').to('output.txt');