'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

export default function User() {
  const { user, logout } = usePrivy();
  const router = useRouter();
  const walletAddress = user?.wallet?.address || '';
  const [copied, setCopied] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const copyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Hide message after 2 seconds
      } catch (err) {
        console.error('Failed to copy address: ', err);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="bg-[#101829] p-7 rounded-full mb-8" >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-20 text-white "><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
        </div>

        <div className="flex items-center space-x-7 space-y-4  ">
          <div className="bg-[#101829] rounded-2xl p-5 w-full flex flex-col space-y-4">
            <div className="flex items-center space-x-3 ">
              <Image src="/wallet.svg" alt="" className='text-white' width={24} height={24} />
              <h3 className="text-white font-semibold text-lg">Wallet Digital</h3>
            </div>
            <div className="flex flex-col space-y-2">
              <p className="text-gray-400 text-sm">Dirección de Wallet</p>
              <div className="bg-[#1e293b] text-white p-3 rounded-lg flex justify-evenly items-center">
                <span className="text-base ">{walletAddress}</span>
                <button  onClick={copyAddress} className="" aria-label="Copy wallet address" >
                  <Image src="/copiar.svg" alt="" width={24} height={24} />
                </button>
              </div>
              {copied && <p className="text-green-400 text-sm mt-1">¡Copiado!</p>}
            </div>
            
            <div className="flex flex-col space-y-2">
              <p className="text-gray-400 text-sm">Balance Disponible</p>
              <div className="bg-[#1A2450] text-white p-3 rounded-lg flex justify-between items-center">
                <span className="text-lg font-bold">$2,450.75 MXNB</span>
              </div>
            </div>

            {/* Disconnect Wallet Button */}
            <button  onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition w-full mt-4">
              Desconectar Wallet
            </button>

          </div>
           {/* Placeholder for other cards */}
           <div className="bg-[#101829] rounded-2xl p-5 w-full " >

           </div>
        </div>
    </div>
  );
} 