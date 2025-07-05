const { requestConversion, signRequest } = require("./requestConversion");
const axios = require("axios");
const path = require("path");

// Cargar variables de entorno
require("dotenv").config({
    path: path.join(__dirname, "../../../../.env.local"),
});

// Parámetros de autenticación
const JUNO_API_KEY = process.env.JUNO_API_KEY;

const fondos = async () => {
    try {
        const endpoint = `/mint_platform/v1/balances`;
        const url = "https://stage.buildwithjuno.com" + endpoint;
        const method = "GET";
        const body = "";
        const { nonce, signature } = signRequest(method, endpoint, body);
        const headers = {
            Authorization: `Bitso ${JUNO_API_KEY}:${nonce}:${signature}`,
            "Content-Type": "application/json",
        };

        try {
            const response = await axios.get(url, { headers });
            console.log("Conversion Response:", response.data.payload);
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

//fondos();

const depositoFake = async () => {
    try {
        const endpoint = `/spei/test/deposits`;
        const url = "https://stage.buildwithjuno.com" + endpoint;
        const method = "POST";
        const bodyData = {
            amount: "1000",
            receiver_clabe: "710969000000374633",
            receiver_name: "NA",
            sender_name: "NA",
        };
        const body = JSON.stringify(bodyData);
        const { nonce, signature } = signRequest(method, endpoint, body);
        const headers = {
            Authorization: `Bitso ${JUNO_API_KEY}:${nonce}:${signature}`,
            "Content-Type": "application/json",
        };

        try {
            const response = await axios.post(url, body, { headers });
            console.log("Conversion Response:", response.data.payload);
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

//depositoFake();

const clabes = async () => {
    try {
        const endpoint = `/spei/v1/clabes`;
        const url = "https://stage.buildwithjuno.com" + endpoint;
        const method = "GET";
        const body = "";
        const { nonce, signature } = signRequest(method, endpoint, body);
        const headers = {
            Authorization: `Bitso ${JUNO_API_KEY}:${nonce}:${signature}`,
            "Content-Type": "application/json",
        };

        try {
            const response = await axios.get(url, { headers });
            console.log("Conversion Response:", response.data.payload);
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

//clabes();

const estadoCuenta = async () => {
    try {
        const endpoint = `/api/v3/account_status`;
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
            console.log("Conversion Response:", response.data.payload);
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

estadoCuenta();
