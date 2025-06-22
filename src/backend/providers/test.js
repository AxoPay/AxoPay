const axios = require("axios");
const CryptoJS = require("crypto-js");

// Parámetros de autenticación
const API_KEY = "VqOvzRgkxK";
const API_SECRET = "c27c09824902d40fcf15ac3ac779228e";

let lastNonce = 0;
const generateNonce = () => {
    const now = Math.floor(Date.now() / 1000);
    if (now <= lastNonce) {
        lastNonce += 1;
        return lastNonce;
    } else {
        lastNonce = now;
        return now;
    }
};

const signRequest = (method, path, body) => {
    const nonce = generateNonce();
    const data = `${nonce}${method}${path}${body}`;
    const hash = CryptoJS.HmacSHA256(data, API_SECRET);
    const signature = CryptoJS.enc.Hex.stringify(hash);

    return { nonce, signature };
};

const getBalance = async () => {
    const endpoint = "/api/v3/fundings";
    const url = "https://stage.bitso.com" + endpoint;
    const method = "GET";
    const body = "";

    const { nonce, signature } = signRequest(method, endpoint, body);
    const headers = {
        Authorization: `Bitso ${API_KEY}:${nonce}:${signature}`,
    };

    try {
        const response = await axios.get(url, { headers });
        console.log("Balance:", response.data);
    } catch (error) {
        console.error(
            "Error:",
            error.response ? error.response.data : error.message
        );
    }
};

getBalance();
