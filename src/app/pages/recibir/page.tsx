"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { ApiService } from "../../../services/apiService";

interface QRScannerProps {
    onScanSuccess: (decodedText: string, decodedResult: any) => void;
    onScanFailure?: (error: string) => void;
}

function QRScanner({ onScanSuccess, onScanFailure }: QRScannerProps) {
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        if (isScanning) {
            const scanner = new Html5QrcodeScanner(
                "qr-reader",
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                },
                false
            );

            scanner.render(
                (decodedText, decodedResult) => {
                    console.log("QR escaneado:", decodedText);
                    onScanSuccess(decodedText, decodedResult);
                    scanner.clear();
                    setIsScanning(false);
                },
                (errorMessage) => {
                    if (onScanFailure) {
                        onScanFailure(errorMessage);
                    }
                }
            );

            scannerRef.current = scanner;
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear();
            }
        };
    }, [isScanning, onScanSuccess, onScanFailure]);

    const startScanning = () => {
        setIsScanning(true);
    };

    const stopScanning = () => {
        if (scannerRef.current) {
            scannerRef.current.clear();
        }
        setIsScanning(false);
    };

    return (
        <div className="space-y-4">
            {!isScanning ? (
                <button
                    onClick={startScanning}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                >
                    <span className="flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                            />
                        </svg>
                        Escanear Código QR
                    </span>
                </button>
            ) : (
                <div className="space-y-4">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">
                            Escaneando QR...
                        </h3>
                        <p className="text-slate-400 text-sm">
                            Apunta la cámara hacia el código QR
                        </p>
                    </div>
                    <div
                        id="qr-reader"
                        className="bg-slate-900 rounded-lg overflow-hidden max-w-full"
                    ></div>
                    <button
                        onClick={stopScanning}
                        className="w-full bg-red-600 hover:bg-red-700 font-bold py-2 px-4 rounded-lg transition"
                    >
                        Cancelar Escaneo
                    </button>
                </div>
            )}
        </div>
    );
}

// Componente principal de la página
export default function RecibirPage() {
    const [scannedResults, setScannedResults] = useState<any[]>([]);

    const handleScanSuccess = (decodedText: string, decodedResult: any) => {
        try {
            console.log("Entra try");
            const parsedData = JSON.parse(decodedText);
            const newResult = {
                id: Date.now(),
                text: decodedText,
                data: parsedData,
                timestamp: new Date().toLocaleString(),
            };
            setScannedResults((prev) => [newResult, ...prev.slice(0, 4)]);
            processWithdrawal(
                parsedData.currency,
                "0xA08BB78c94166b7854391Ad4F30A853eFE245f7d",
                parsedData.amount
            );
        } catch (error) {
            console.error("Error parsing QR:", error);
            const newResult = {
                id: Date.now(),
                text: decodedText,
                data: decodedText,
                timestamp: new Date().toLocaleString(),
            };
            setScannedResults((prev) => [newResult, ...prev.slice(0, 4)]);
        }
    };

    const processWithdrawal = async (
        currency: string,
        to: string,
        amount: string
    ) => {
        console.log("Procesando retiro:" + amount + " " + currency + " " + to);

        try {
            console.log("Try 2");
            const result = await ApiService.processWithdrawal({
                currency: String(currency),
                to: String(to),
                amount: amount,
            });
            console.log("Retiro exitoso:", result);
            alert("Retiro procesado exitosamente");
        } catch (error: any) {
            console.error("Error en retiro:", error);
        }
    };

    const handleScanFailure = (error: string) => {
        console.error("Scan failed:", error);
    };

    const handleSubmit = () => {};

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4 text-white">
            <div className="w-full max-w-2xl mx-auto">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-700">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold mb-2">
                            Recibir Pagos
                        </h1>
                        <p className="text-slate-400">
                            Escanea un código QR para recibir un pago
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <div className="relative m-2">
                                <select
                                    id="sendFrom"
                                    //value={sendFrom}
                                    //</div>onChange={(e) =>
                                    //setsendFrom(e.target.value)
                                    //}
                                    className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        ¿En dónde deseas recibir el pago?
                                    </option>
                                    <option value="wallet1">
                                        Wallet Principal
                                    </option>
                                    <option value="bank1">
                                        Cuenta Bancaria (**** 1234)
                                    </option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                                    <svg
                                        className="fill-current h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </form>
                    <QRScanner
                        onScanSuccess={handleScanSuccess}
                        onScanFailure={handleScanFailure}
                    />
                    {scannedResults.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold mb-4">
                                Códigos QR Escaneados
                            </h3>
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                {scannedResults.map((result) => (
                                    <div
                                        key={result.id}
                                        className="bg-slate-900/80 p-3 rounded-lg border border-slate-600"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-sm text-slate-400">
                                                {result.timestamp}
                                            </span>
                                        </div>
                                        <div className="bg-slate-800 p-2 rounded text-xs font-mono overflow-x-auto">
                                            {typeof result.data === "object"
                                                ? JSON.stringify(
                                                      result.data,
                                                      null,
                                                      2
                                                  )
                                                : result.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
