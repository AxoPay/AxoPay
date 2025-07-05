'use client'

import { useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import Checkout from '../components/Checkout'
import SavedCards from '../components/SavedCards'
import { getCustomerCards } from '../actions/stripe'
import Modal from '../components/Modal'

export default function User() {
  const { user } = usePrivy()
  const [showCheckout, setShowCheckout] = useState(false)
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadCards = async () => {
    try {
      const cards = await getCustomerCards(user?.email)
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
    if (user?.email) {
      loadCards()
    }
  }, [user?.email])

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

        <Modal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          title="Agregar Nueva Tarjeta"
        >
          <div className="w-full min-h-[400px]">
            <Checkout 
              email={user?.email} 
              onSuccess={handleSuccess} 
            />
          </div>
        </Modal>
      </div>
    </div>
  )
} 