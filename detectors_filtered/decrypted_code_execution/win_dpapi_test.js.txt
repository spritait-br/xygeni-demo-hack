import * as dpapi from "node-dpapi";

const buffer = Buffer.from("Hello world", "utf-8");

const encrypted = dpapi.protectData(buffer, null, "CurrentUser");
const decryptedData = dpapi.unprotectData(encrypted, null, "CurrentUser");

eval(decryptedData)