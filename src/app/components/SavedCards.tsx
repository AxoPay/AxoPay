'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getCustomerCards } from '../actions/stripe'

interface Card {
  id: string
  brand: string
  last4: string
  expMonth: number
  expYear: number
}

export default function SavedCards() {
  const [cards, setCards] = useState<Card[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>()

  const loadCards = async () => {
    try {
      setIsLoading(true)
      const savedCards = await getCustomerCards()
      console.log('Loaded cards:', savedCards)
      setCards(savedCards)
    } catch (error) {
      console.error('Error loading cards:', error)
      setError('No se pudieron cargar las tarjetas guardadas')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCards()
  }, [])

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return '💳' // Reemplazar con el ícono real de Visa
      case 'mastercard':
        return '💳' // Reemplazar con el ícono real de Mastercard
      default:
        return '💳'
    }
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        <p>{error}</p>
        <button
          onClick={loadCards}
          className="mt-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
        >
          Intentar de nuevo
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {cards.length === 0 ? (
        <p className="text-gray-400 text-center">No hay tarjetas guardadas</p>
      ) : (
        cards.map((card) => (
          <div
            key={card.id}
            className="bg-[#1e293b] rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getCardIcon(card.brand)}</span>
              <div>
                <p className="text-white font-medium">
                  •••• •••• •••• {card.last4}
                </p>
                <p className="text-gray-400 text-sm">
                  Expira: {card.expMonth.toString().padStart(2, '0')}/{card.expYear}
                </p>
              </div>
            </div>
            <button
              className="text-red-500 hover:text-red-600 text-sm"
              onClick={() => {
                // Implementar eliminación de tarjeta
                console.log('Eliminar tarjeta:', card.id)
              }}
            >
              Eliminar
            </button>
          </div>
        ))
      )}
    </div>
  )
} 