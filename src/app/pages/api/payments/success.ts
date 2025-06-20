import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Aquí puedes manejar la lógica posterior al pago exitoso (como guardar la transacción en la base de datos)
    res.send("Pago completado con éxito");
}
