'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function Return() {
  const [status, setStatus] = useState<'success' | 'error' | 'processing'>('processing')
  const searchParams = useSearchParams()
  const router = useRouter()
  
  useEffect(() => {
    const setupIntentResult = searchParams.get('setup_intent')
    const setupIntentClientSecret = searchParams.get('setup_intent_client_secret')
    const redirectStatus = searchParams.get('redirect_status')

    if (redirectStatus === 'succeeded') {
      setStatus('success')
    } else if (redirectStatus === 'failed') {
      setStatus('error')
    }
  }, [searchParams])

  if (status === 'processing') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#101829]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-[#101829] flex items-center justify-center">
        <section className="max-w-md mx-auto p-4">
          <h2 className="text-xl font-bold mb-4 text-red-500">Error al guardar la tarjeta</h2>
          <p className="mb-4 text-white">
            Hubo un problema al procesar tu tarjeta. Por favor, intenta de nuevo.
          </p>
          <button
            onClick={() => router.push('/user')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Volver a intentar
          </button>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#101829] flex items-center justify-center">
      <section className="max-w-md mx-auto p-4">
        <h2 className="text-xl font-bold mb-4 text-green-500">¡Tarjeta guardada exitosamente!</h2>
        <p className="mb-4 text-white">
          Tu tarjeta ha sido guardada correctamente y podrá ser utilizada para futuros pagos.
        </p>
        <button
          onClick={() => router.push('/user')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Volver a mi perfil
        </button>
      </section>
    </div>
  )
} 