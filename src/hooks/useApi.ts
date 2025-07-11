import { useState, useCallback } from "react";

export interface ApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useApi<T>() {
    const [state, setState] = useState<ApiState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const execute = useCallback(
        async (apiCall: () => Promise<T>): Promise<T | null> => {
            setState((prev) => ({ ...prev, loading: true, error: null }));

            try {
                const result = await apiCall();
                setState((prev) => ({ ...prev, data: result, loading: false }));
                return result;
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : "Error desconocido";
                setState((prev) => ({
                    ...prev,
                    error: errorMessage,
                    loading: false,
                }));
                return null;
            }
        },
        []
    );

    const reset = useCallback(() => {
        setState({
            data: null,
            loading: false,
            error: null,
        });
    }, []);

    const clearError = useCallback(() => {
        setState((prev) => ({ ...prev, error: null }));
    }, []);

    return {
        ...state,
        execute,
        reset,
        clearError,
    };
}

// Hook específico para balances
export function useBalances() {
    const api = useApi<any>();

    const fetchBalances = useCallback(async () => {
        const { ApiService } = await import("../services/apiService");
        return api.execute(() => ApiService.getBalances());
    }, [api]);

    return {
        ...api,
        fetchBalances,
    };
}

// Hook específico para conversiones
export function useConversions() {
    const api = useApi<any>();

    const requestConversion = useCallback(
        async (fromCurrency: string, amount: number) => {
            const { ApiService } = await import("../services/apiService");
            return api.execute(() =>
                ApiService.requestConversion({ fromCurrency, amount })
            );
        },
        [api]
    );

    const executeConversion = useCallback(
        async (conversionId: string) => {
            const { ApiService } = await import("../services/apiService");
            return api.execute(() =>
                ApiService.executeConversion({ conversionId })
            );
        },
        [api]
    );

    return {
        ...api,
        requestConversion,
        executeConversion,
    };
}

// Hook específico para retiros
export function useWithdrawals() {
    const api = useApi<any>();

    const processWithdrawal = useCallback(
        async (currency: string, to: string, amount: number) => {
            const { ApiService } = await import("../services/apiService");
            return api.execute(() =>
                ApiService.processWithdrawal({ currency, to, amount })
            );
        },
        [api]
    );

    return {
        ...api,
        processWithdrawal,
    };
}
