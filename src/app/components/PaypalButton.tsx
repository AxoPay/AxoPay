import React, { useEffect } from "react";

// Agrega esto para que TypeScript reconozca window.paypal
declare global {
    interface Window {
        paypal: any;
    }
}

interface PaypalButtonProps {
    containerId?: string;
}

const PaypalButton: React.FC<PaypalButtonProps> = ({
    containerId = "paypal-button-container",
}) => {
    useEffect(() => {
        // Cargar el script de PayPal en el frontend
        const script = document.createElement("script");
        script.src =
            "https://www.paypal.com/sdk/js?client-id=AVsMHyLTGy_sxdRNW6XvIakAAzmdQPkyIxjEzZ-Iz1rEuSzH0ns55_wF5pONglfltMtCk7aX0c_K2kRP&currency=USD&locale=es_ES";
        script.async = true;
        script.onload = () => {
            // Iniciar el botón de PayPal una vez que el script se haya cargado
            if (window.paypal) {
                window.paypal
                    .Buttons({
                        createOrder: async (data: any, actions: any) => {
                            // Llama a tu backend para crear la orden y obtener el orderID
                            const res = await fetch("/api/payments/paypal", {
                                method: "POST",
                                body: JSON.stringify({ amount: "10.00" }),
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            });
                            const dataRes = await res.json();
                            return dataRes.orderID; // Asegúrate que tu backend devuelva { orderID: "..." }
                        },
                        onApprove: (data: any, actions: any) => {
                            return actions.order
                                .capture()
                                .then(function (details: any) {
                                    alert(
                                        "Pago completado por " +
                                            details.payer.name.given_name
                                    );
                                });
                        },
                        onCancel: (data: any) => {
                            alert("Pago cancelado");
                        },
                    })
                    .render(`#${containerId}`); // Renderiza en el contenedor especificado
            }
        };
        document.body.appendChild(script);
        // Limpieza: eliminar el script y el botón de PayPal al desmontar
        return () => {
            script.remove();
            const paypalContainer = document.getElementById(containerId);
            if (paypalContainer) paypalContainer.innerHTML = "";
        };
    }, [containerId]);

    return <div id={containerId}></div>; // Renderiza el botón en el contenedor indicado
};

export default PaypalButton;
