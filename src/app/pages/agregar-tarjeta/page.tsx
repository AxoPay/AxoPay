'use client'

import { useRouter } from 'next/navigation'
import Checkout from '@/app/components/Checkout'

export default function AgregarTarjetaPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/pages/user') // Redirige de vuelta a la página de usuario
  }

  return (
    <div className="min-h-screen bg-[#050b15] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Agregar Nueva Tarjeta</h1>
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        <div className="bg-[#101829] rounded-2xl p-6">
          <Checkout onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  )
} 