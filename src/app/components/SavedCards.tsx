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
  cardType: string
  country: string
  name: string | null
}

interface SavedCardsProps {
  cards: Card[]
  onDisconnect: (cardId: string) => void
}

export default function SavedCards({ cards, onDisconnect }: SavedCardsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>()

  const loadCards = async () => {
    try {
      setIsLoading(true)
      const savedCards = await getCustomerCards()
      console.log('Loaded cards:', savedCards)
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

  const getBrandIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return '💳'
      case 'mastercard':
        return '💳'
      case 'amex':
        return '💳'
      default:
        return '💳'
    }
  }

  const formatExpiryDate = (month: number, year: number) => {
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`
  }

  const getCardTypeText = (type: string) => {
    switch (type.toLowerCase()) {
      case 'credit':
        return 'Crédito'
      case 'debit':
        return 'Débito'
      default:
        return type
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

  if (cards.length === 0) {
    return (
      <div className="text-gray-400 text-center p-8">
        <p>No hay tarjetas guardadas</p>
        <p className="mt-2 text-sm">Haz clic en "Agregar Nueva Tarjeta" para comenzar</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-[#0A0F1C] rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <span className="text-2xl">{getBrandIcon(card.brand)}</span>
              <div>
                <p className="text-white font-medium">
                  •••• •••• •••• {card.last4}
                </p>
                <p className="text-gray-400 text-sm">
                  Expira: {formatExpiryDate(card.expMonth, card.expYear)}
                </p>
              </div>
            </div>
            <button
              onClick={() => onDisconnect(card.id)}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded transition"
            >
              Desconectar
            </button>
          </div>
          <div className="border-t border-gray-700 pt-3 mt-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-400">Tipo</p>
                <p className="text-white">{getCardTypeText(card.cardType)}</p>
              </div>
              {card.name && (
                <div>
                  <p className="text-gray-400">Titular</p>
                  <p className="text-white">{card.name}</p>
                </div>
              )}
              <div>
                <p className="text-gray-400">País</p>
                <p className="text-white">{card.country.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-gray-400">Marca</p>
                <p className="text-white capitalize">{card.brand}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 