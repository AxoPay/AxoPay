'use client'

import { useState, useEffect } from 'react'
import Checkout from '../components/Checkout'
import SavedCards from '../components/SavedCards'
import { getCustomerCards } from '../actions/stripe'

export default function User() {
  const [showCheckout, setShowCheckout] = useState(false)
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadCards = async () => {
    try {
      const cards = await getCustomerCards()
      setCards(cards)
      setError(null)
    } catch (err) {
      console.error('Error loading cards:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar las tarjetas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCards()
  }, [])

  const handleSuccess = async () => {
    setShowCheckout(false)
    await loadCards() // Recargar las tarjetas después de agregar una nueva
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Mis Tarjetas</h1>
          <button
            onClick={() => setShowCheckout(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Agregar Nueva Tarjeta
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <SavedCards cards={cards} onUpdate={loadCards} />
        )}

        {showCheckout && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#0A0F1C] rounded-lg shadow-xl max-w-md w-full relative">
              <button
                onClick={() => setShowCheckout(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Agregar Nueva Tarjeta</h2>
                <Checkout onSuccess={handleSuccess} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 