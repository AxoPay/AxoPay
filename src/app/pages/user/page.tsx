'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import Checkout from '../../components/Checkout';
import Modal from '../../components/Modal';

export default function User() {
  const { user, logout, login } = usePrivy();
  const router = useRouter();
  const walletAddress = user?.wallet?.address || '';
  const [copied, setCopied] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const copyAddress = () => {
    if (walletAddress) {
      try {
        navigator.clipboard.writeText(walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); 
      } catch (err) {
        console.error('Failed to copy address: ', err);
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0F1C] text-white pt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <div className="bg-[#101829] p-7 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-20 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
          </div>

          <div className="flex justify-center items-start gap-8">
            {/* Card de Wallet */}
            <div className="bg-[#101829] w-[45%] rounded-2xl p-6 flex flex-col space-y-4">
              <div className="flex items-center space-x-3">
                <Image src="/wallet.svg" alt="" className='text-white' width={24} height={24} />
                <h3 className="text-white font-semibold text-lg">Wallet Digital</h3>
              </div>
              <div className="flex flex-col space-y-2">
                <div className='flex justify-between'>
                  <p className="text-gray-400 text-sm">Dirección de Wallet</p>
                  <button onClick={copyAddress} className="cursor-pointer" aria-label="Copy wallet address">
                    <Image src="/copiar.svg" alt="" width={24} height={24} />
                  </button>
                </div>
                <div className="bg-[#1e293b] text-white p-3 rounded-lg flex justify-evenly items-center">
                  <span className="text-base break-all">{walletAddress || 'No conectado'}</span>
                </div>
                {copied && <p className="text-green-400 text-sm mt-1">¡Copiado!</p>}
              </div>
              
              <div className="flex flex-col space-y-2">
                <p className="text-gray-400 text-sm">Balance Disponible</p>
                <div className="bg-[#1A2450] text-white p-3 rounded-lg flex justify-between items-center">
                  <span className="text-lg font-bold">$2,450.75 MXNB</span>
                </div>
              </div>
              
              <button 
                onClick={user ? handleLogout : login} 
                className={`${
                  user ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                } text-white font-semibold py-2 px-4 rounded transition cursor-pointer w-full`}
              >
                {user ? 'Desconectar Wallet' : 'Conectar Wallet'}
              </button>
            </div>

            {/* Card de Tarjetas */}
            <div className="bg-[#101829] rounded-2xl p-6 w-[45%]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Image src="/file.svg" alt="" width={24} height={24} />
                  <h3 className="text-white font-semibold text-lg">Mis Tarjetas</h3>
                </div>
              </div>

              <div className="text-gray-400 text-center p-8">
                <p>No hay tarjetas guardadas</p>
                <p className="mt-2 text-sm">Haz clic en "Agregar Nueva Tarjeta" para comenzar</p>
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition w-full mt-4"
              >
                Agregar Nueva Tarjeta
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        title="Agregar Nueva Tarjeta"
      >
        <div className="w-full min-h-[400px]">
          <Checkout onSuccess={() => setShowCheckout(false)} />
        </div>
      </Modal>
    </main>
  );
} 