'use server'

import Stripe from 'stripe'
import { stripe } from './stripe-config'

// Función de utilidad para manejar errores de Stripe
export async function handleStripeError(error) {
  console.error('Stripe error:', error)
  
  if (error instanceof Stripe.errors.StripeError) {
    // Manejar errores específicos de Stripe
    switch (error.type) {
      case 'StripeCardError':
        return 'Error con la tarjeta proporcionada.'
      case 'StripeInvalidRequestError':
        return 'Solicitud inválida a Stripe.'
      case 'StripeAPIError':
        return 'Error en la API de Stripe.'
      case 'StripeConnectionError':
        return 'Error de conexión con Stripe.'
      case 'StripeAuthenticationError':
        return 'Error de autenticación con Stripe.'
      default:
        return 'Error al procesar el pago.'
    }
  }
  
  return 'Error inesperado al procesar la solicitud.'
}