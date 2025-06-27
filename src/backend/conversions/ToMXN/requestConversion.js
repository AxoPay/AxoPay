const axios = require("axios");
const CryptoJS = require("crypto-js");
const path = require("path");

// Cargar variables de entorno desde la raíz del proyecto
require("dotenv").config({
    path: path.join(__dirname, "../../../../.env.local"),
});

// Parámetros de autenticación
const JUNO_API_KEY = process.env.JUNO_API_KEY;
const JUNO_SECRET_KEY = process.env.JUNO_SECRET_KEY;

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
    const hash = CryptoJS.HmacSHA256(data, JUNO_SECRET_KEY);
    const signature = CryptoJS.enc.Hex.stringify(hash);

    return { nonce, signature };
};

const getErrorCode = (error) => {
    if (error.response && error.response.data && error.response.data.error) {
        return error.response.data.error.code;
    }
    return null;
};

const requestConversion = async (fromCurrency, amount) => {
    const endpoint = "/api/v4/currency_conversions";
    const url = "https://stage.bitso.com" + endpoint;
    const method = "POST";
    const bodyData = {
        from_currency: String(fromCurrency),
        to_currency: "mxn",
        receive_amount: String(amount),
    };
    const body = JSON.stringify(bodyData);
    let id = null;
    const { nonce, signature } = signRequest(method, endpoint, body);
    const headers = {
        Authorization: `Bitso ${JUNO_API_KEY}:${nonce}:${signature}`,
        "Content-Type": "application/json",
    };

    try {
        const response = await axios.post(url, body, { headers });
        id = response.data.payload.id;
        console.log("Conversion Response:", response.data);
    } catch (error) {
        const errorCode = getErrorCode(error);
        if (errorCode === "0304") {
            console.log("No existe la moneda que deseas convertir");
        } else if (error.response && error.response.data) {
            console.error("Error:", error.response.data);
        } else {
            console.error("Error:", error.message);
        }
    }
    return id;
};

module.exports = {
    requestConversion,
    generateNonce,
    signRequest,
};
