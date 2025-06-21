'use client';

import { useState } from 'react';

const QrPaymentForm = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [receiveIn, setReceiveIn] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ amount, currency, receiveIn });
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          Generar Código QR para Pagos
        </h1>
        <p className="text-slate-400 mb-8">
          Crea un QR para recibir pagos. El emisor podrá pagar desde su banco o wallet.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-slate-300 mb-2">
            Monto a Recibir
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label htmlFor="receiveIn" className="block text-sm font-medium text-slate-300 mb-2">
            Recibir en
          </label>
          <div className="relative">
            <select
              id="receiveIn"
              value={receiveIn}
              onChange={(e) => setReceiveIn(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
              defaultValue=""
            >
              <option value="" disabled>¿Dónde quieres recibir?</option>
              <option value="wallet1">Wallet Principal</option>
              <option value="bank1">Cuenta Bancaria (**** 1234)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
        >
          Generar Código QR
        </button>
      </form>
    </>
  );
};

const DirectTransferForm = () => {
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ fromAccount, toAccount, amount, recipientAddress });
  };
  
  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          Transferencia Directa
        </h1>
        <p className="text-slate-400 mb-8">
          Envía dinero desde tu banco a una wallet o desde tu wallet a una cuenta bancaria.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna Desde */}
          <div className="space-y-6">
            <h3 className="flex items-center text-lg font-semibold text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              Desde
            </h3>
            <div>
              <label htmlFor="fromAccount" className="block text-sm font-medium text-slate-300 mb-2">Tipo de Cuenta</label>
              <div className="relative">
                <select id="fromAccount" value={fromAccount} onChange={(e) => setFromAccount(e.target.value)} className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none" defaultValue="">
                  <option value="" disabled>Selecciona origen</option>
                  <option value="wallet">Wallet</option>
                  <option value="bank">Cuenta Bancaria</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div>
              </div>
            </div>
            <div>
              <label htmlFor="transferAmount" className="block text-sm font-medium text-slate-300 mb-2">Monto a Enviar</label>
              <input type="number" id="transferAmount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
            </div>
          </div>
          {/* Columna Hacia */}
          <div className="space-y-6">
            <h3 className="flex items-center text-lg font-semibold text-slate-300">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.284-1.255-.778-1.682M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.284-1.255.778-1.682M12 15a3 3 0 100-6 3 3 0 000 6z" /></svg>
              Hacia
            </h3>
            <div>
              <label htmlFor="toAccount" className="block text-sm font-medium text-slate-300 mb-2">Tipo de Destino</label>
              <div className="relative">
                <select id="toAccount" value={toAccount} onChange={(e) => setToAccount(e.target.value)} className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none" defaultValue="">
                  <option value="" disabled>Selecciona destino</option>
                  <option value="wallet">Wallet</option>
                  <option value="bank">Cuenta Bancaria</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div>
              </div>
            </div>
            <div>
              <label htmlFor="recipientAddress" className="block text-sm font-medium text-slate-300 mb-2">Dirección del Destinatario</label>
              <input type="text" id="recipientAddress" value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} placeholder="0x... o CLABE bancaria" className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Tipo de cambio actual:</span>
            <span className="font-semibold">1 USD = $18.50 MXN</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Comisión:</span>
            <span className="font-semibold text-green-400">0.5%</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
        >
          Realizar Transferencia
        </button>
      </form>
    </>
  );
};

export default function TransaccionPage() {
  const [activeTab, setActiveTab] = useState('qr');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4 text-white">
      <div className="w-full max-w-2xl">
        <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-1 flex justify-center space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('qr')}
            className={`w-1/2 py-2 px-4 rounded-md transition font-semibold text-sm focus:outline-none ${activeTab === 'qr' ? 'bg-blue-600 shadow-md' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6.5 6.5l-1-1M6 12a6 6 0 1112 0 6 6 0 01-12 0zm5-8.5a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zM12 18a.5.5 0 01-.5.5h-1a.5.5 0 010-1h1a.5.5 0 01.5.5z" /></svg>
              Pagos con QR
            </span>
          </button>
          <button
            onClick={() => setActiveTab('transfer')}
            className={`w-1/2 py-2 px-4 rounded-md transition font-semibold text-sm focus:outline-none ${activeTab === 'transfer' ? 'bg-blue-600 shadow-md' : 'text-slate-400 hover:bg-slate-800'}`}
          >
             <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              Transferencia Directa
            </span>
          </button>
        </div>

        <div className="w-full bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-700">
          {activeTab === 'qr' && <QrPaymentForm />}
          {activeTab === 'transfer' && <DirectTransferForm />}
        </div>
      </div>
    </div>
  );
} 