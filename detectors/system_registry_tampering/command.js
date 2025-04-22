const { exec } = require("child_process");
exec("HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run", (error, data, getter) => {
    if(error){
        console.log("error",error.message);
        return;
    }
    if(getter){
        console.log(data);
        return;
    }
    console.log(data);
});
