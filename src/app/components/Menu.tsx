'use client';

import Link from "next/link";
import { usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';

export default function Menu() {
  const { login, authenticated, user } = usePrivy();

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-5)}`;
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full backdrop-blur-md bg-transparent border-none z-50">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Image src="/AxoCoinUno.png" alt="AxoCoin" className="w-10 h-10" width={40} height={40} />
            <h1 className="text-white font-sans font-semibold text-3xl select-none">AxoPay</h1>
          </div>

          <ul className="flex space-x-8 text-white font-medium">
            <li>
              <Link href="/" className="hover:text-gray-300 transition">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/servicios" className="hover:text-gray-300 transition">
                Servicios
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-gray-300 transition">
                Contacto
              </Link>
            </li>
            <li>
              <Link href="/acerca" className="hover:text-gray-300 transition">
                Acerca
              </Link>
            </li>
            <li>
              <Link href="/pages/user" className="hover:text-gray-300 transition">
                Perfil
              </Link>
            </li>
          </ul>

          <div className="flex items-center space-x-4">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
            >
              Conectar Cuenta Bancaria
            </button>
            {!authenticated ? (
              <button 
                onClick={login}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
              >
                Conectar Wallet
              </button>
            ) : (
              <span className="text-white font-medium">
                {truncateAddress(user?.wallet?.address || '')}
              </span>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
