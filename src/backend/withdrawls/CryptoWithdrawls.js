const axios = require("axios");
const path = require("path");
const CryptoJS = require("crypto-js");

// Cargar variables de entorno
require("dotenv").config({
    path: path.join(__dirname, "../../../.env.local"),
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

const getParameters = async (currency) => {
    try {
        const endpoint = `/api/v3/withdrawal_methods/${currency}`;
        const url = "https://stage.bitso.com" + endpoint;
        const method = "GET";
        const body = "";
        const { nonce, signature } = signRequest(method, endpoint, body);
        const headers = {
            Authorization: `Bitso ${JUNO_API_KEY}:${nonce}:${signature}`,
            "Content-Type": "application/json",
        };

        try {
            const response = await axios.get(url, { headers });
            const method = response.data.payload[1].method;
            const network = response.data.payload[1].network;
            const protocol = response.data.payload[1].protocol;
            return { method, network, protocol };
        } catch (error) {
            if (error.response && error.response.data) {
                console.error("Error:", error.response.data);
            } else {
                console.error("Error:", error.message);
            }
        }
    } catch (error) {
        console.error("Error en la ejecución:", error);
    }
};

const seeParameters = async () => {
    try {
        const params = await getParameters("btc");
        console.log(params);
    } catch (error) {
        console.error("Error al obtener los parámetros:", error);
    }
};

seeParameters();

const withdrawl = async (currency, to, amount) => {
    try {
        const { methodW, network, protocol } = await getParameters(currency);
        const endpoint = `/api/v3/withdrawals`;
        const url = "https://stage.bitso.com" + endpoint;
        const method = "POST";
        const bodyData = {
            address: String(to),
            amount: String(amount),
            asset: String(currency),
            currency: String(currency),
            max_fee: "0.0001",
            method: String(methodW),
            network: String(network),
            protocol: String(protocol),
        };
        const body = JSON.stringify(bodyData);
        const { nonce, signature } = signRequest(method, endpoint, body);
        const headers = {
            Authorization: `Bitso ${JUNO_API_KEY}:${nonce}:${signature}`,
            "Content-Type": "application/json",
        };

        try {
            const response = await axios.post(url, body, { headers });
            console.log("Conversion Response:", response.data);
        } catch (error) {
            if (error.response && error.response.data) {
                console.error("Error:", error.response.data);
            } else {
                console.error("Error:", error.message);
            }
        }
    } catch (error) {
        console.error("Error en la ejecución:", error);
    }
};

withdrawl("btc", "tu_direccion_btc_aqui", 0.0001);
