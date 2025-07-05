import { NextResponse } from 'next/server'
import { stripe } from '../../../lib/stripe-config'
import { handleStripeError } from '../../../lib/stripe'

export async function POST(request: Request) {
  try {
    const { action, data } = await request.json()

    switch (action) {
      case 'fetchClientSecret':
        try {
          const setupIntent = await stripe.setupIntents.create({
            payment_method_types: ['card'],
            usage: 'off_session',
          })
          return NextResponse.json({ clientSecret: setupIntent.client_secret })
        } catch (error) {
          console.error('Error creating setup intent:', error)
          const errorMessage = await handleStripeError(error)
          return NextResponse.json({ error: errorMessage }, { status: 500 })
        }

      case 'getCustomerCards':
        try {
          const { email } = data
          if (!email) {
            return NextResponse.json({ cards: [] })
          }

          // Buscar o crear el cliente
          let customer
          const existingCustomers = await stripe.customers.list({
            email: email,
            limit: 1
          })

          if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0]
          } else {
            // Crear nuevo cliente
            customer = await stripe.customers.create({
              email: email,
              metadata: {
                createdAt: new Date().toISOString()
              }
            })
          }

          // Obtener los métodos de pago del cliente
          const paymentMethods = await stripe.paymentMethods.list({
            customer: customer.id,
            type: 'card',
          })

          return NextResponse.json({ 
            cards: paymentMethods.data,
            customerId: customer.id 
          })
        } catch (error) {
          console.error('Error getting customer cards:', error)
          const errorMessage = await handleStripeError(error)
          return NextResponse.json({ error: errorMessage }, { status: 500 })
        }

      default:
        return NextResponse.json(
          { error: 'Acción no soportada' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error parsing request:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 400 }
    )
  }
} 