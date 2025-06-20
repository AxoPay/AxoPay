"use client";

import React, { useState } from "react";
import PaypalButton from "@/app/components/PaypalButton";

export default function PaypalModal() {
    return (
        <div>
            <div className="flex-col flex items-center justify-center min-h-screen bg-[#101829] p-6">
                <h2 className="text-xl font-bold mb-4 text-center  text-white">
                    Pago con PayPal
                </h2>
                <PaypalButton containerId="paypal-button-container-modal" />
            </div>
        </div>
    );
}
