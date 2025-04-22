const axios = require("axios");

async function getServer() {
    const res = await axios({
        url: `https://apiv2.gofile.io/getServer`,
        method: "GET",
        headers: {
            accept: "*/*",
            "accept-language": "en-US,en;",
            "cache-control": "no-cache",
            pragma: "no-cache",
            referrer: "https://gofile.io/uploadFiles",
            mode: "cors",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36 Edg/85.0.564.44",
            dnt: 1,
            origin: "https://gofile.io"
        },
    });

    if (res.data.status !== "ok") {
        throw new Error(`Fetching server info failed: ${JSON.stringify(res.data)}`);
    }

    return res.data.data.server;
}