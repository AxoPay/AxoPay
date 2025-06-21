'use client';

import Link from "next/link";
import Image from 'next/image';
import { useState } from 'react';

export default function Menu() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);

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
            <li className="relative">
              <button 
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="hover:text-gray-300 transition flex items-center"
              >
                Servicios
                <svg 
                  className={`ml-1 w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/20">
                  <ul className="py-2">
                    <li>
                      <Link 
                        href="/pages/transaccion" 
                        className="block px-4 py-2 text-white hover:bg-white/20 transition"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        Transacción
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/pages/multitransaccion" 
                        className="block px-4 py-2 text-white hover:bg-white/20 transition"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        Multitransacción
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/pages/opcion3" 
                        className="block px-4 py-2 text-white hover:bg-white/20 transition"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        Opción 3
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
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
        </nav>
      </header>
    </>
  );
}
