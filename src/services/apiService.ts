const API_BASE_URL = "/api";

export interface ConversionRequest {
    fromCurrency: string;
    amount: number;
}

export interface WithdrawalRequest {
    currency: string;
    to: string;
    amount: number;
}

export interface ExecuteConversionRequest {
    conversionId: string;
}

export class ApiService {
    // Método para solicitar conversiones
    static async requestConversion(data: ConversionRequest) {
        try {
            const response = await fetch(`${API_BASE_URL}/conversions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || "Error en la conversión");
            }

            return result;
        } catch (error) {
            console.error("Error en requestConversion:", error);
            throw error;
        }
    }

    // Método para ejecutar conversiones
    static async executeConversion(data: ExecuteConversionRequest) {
        try {
            const response = await fetch(`${API_BASE_URL}/execute-conversion`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || "Error ejecutando conversión");
            }

            return result;
        } catch (error) {
            console.error("Error en executeConversion:", error);
            throw error;
        }
    }

    // Método para procesar retiros
    static async processWithdrawal(data: WithdrawalRequest) {
        try {
            const response = await fetch(`${API_BASE_URL}/withdrawls`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            return result;
        } catch (error) {
            console.error("Error en processWithdrawal:", error);
            throw error;
        }
    }

    // Método para obtener balances
    static async getBalances() {
        try {
            const response = await fetch(`${API_BASE_URL}/balances`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || "Error obteniendo balances");
            }

            return result;
        } catch (error) {
            console.error("Error en getBalances:", error);
            throw error;
        }
    }

    // Método para obtener parámetros de retiro
    static async getWithdrawalParameters() {
        try {
            const response = await fetch(
                `${API_BASE_URL}/withdrawal-parameters`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || "Error obteniendo parámetros");
            }

            return result;
        } catch (error) {
            console.error("Error en getWithdrawalParameters:", error);
            throw error;
        }
    }

    // Método genérico para manejar errores de red
    static handleNetworkError(error: any): string {
        if (error instanceof TypeError && error.message.includes("fetch")) {
            return "Error de conexión. Verifica tu conexión a internet.";
        }

        if (error.message) {
            return error.message;
        }

        return "Error desconocido. Inténtalo de nuevo.";
    }
}

// Exportar tipos para usar en otros archivos
export type { ConversionRequest, WithdrawalRequest, ExecuteConversionRequest };
