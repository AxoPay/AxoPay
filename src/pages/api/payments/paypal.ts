import type { NextApiRequest, NextApiResponse } from "next";
import paypal from "@paypal/checkout-server-sdk";

// Configura el entorno de PayPal
const environment = new paypal.core.SandboxEnvironment(
    "AVsMHyLTGy_sxdRNW6XvIakAAzmdQPkyIxjEzZ-Iz1rEuSzH0ns55_wF5pONglfltMtCk7aX0c_K2kRP", // Client ID
    "EDTnnQlUa9VAcqjmMeTsTLQWP_oKu-tn_efEjGS6KuIh7kaTq5snCFw2b2esuDWTEQhDXwTH9nRrXySt" // Secret
);
const client = new paypal.core.PayPalHttpClient(environment);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const { amount } = req.body;

        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: amount,
                    },
                    description: "Pago en mi tienda",
                },
            ],
        });

        try {
            const order = await client.execute(request);
            res.status(200).json({ orderID: order.result.id });
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al crear la orden de PayPal");
        }
    } else {
        res.status(405).send("Método no permitido");
    }
}
