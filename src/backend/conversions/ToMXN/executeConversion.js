const { requestConversion, signRequest } = require("./requestConversion");
const axios = require("axios");
const path = require("path");

// Cargar variables de entorno
require("dotenv").config({
    path: path.join(__dirname, "../../../../.env.local"),
});

// Parámetros de autenticación
const JUNO_API_KEY = process.env.JUNO_API_KEY;

const executeConversion = async () => {
    try {
        const result = await requestConversion("btc", 0.000001);
        const endpoint = `/api/v4/currency_conversions/${result}`;
        const url = "https://stage.bitso.com" + endpoint;
        const method = "PUT";
        const bodyData = {};
        const body = JSON.stringify(bodyData);
        const { nonce, signature } = signRequest(method, endpoint, body);
        const headers = {
            Authorization: `Bitso ${JUNO_API_KEY}:${nonce}:${signature}`,
            "Content-Type": "application/json",
        };

        try {
            const response = await axios.put(url, body, { headers });
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

executeConversion();
