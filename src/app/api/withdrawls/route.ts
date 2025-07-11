import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { currency, to, amount } = await request.json();

        // Importar el módulo de retiros
        const { withdrawl } = await import(
            "../../../backend/withdrawls/CryptoWithdrawls.js"
        );

        // Ejecutar el retiro
        const result = await withdrawl(currency, to, amount);

        return NextResponse.json({
            success: true,
            result,
            message: "Retiro procesado exitosamente",
        });
    } catch (error) {
        console.error("Error en retiro:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Error al procesar el retiro",
            },
            { status: 500 }
        );
    }
}
