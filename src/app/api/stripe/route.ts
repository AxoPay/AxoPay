import { NextResponse } from 'next/server'
import { stripe } from '../../../lib/stripe-config'
import { handleStripeError } from '../../../lib/stripe'

export async function POST(request: Request) {
  try {
    const { action, data } = await request.json()

    switch (action) {
      case 'fetchClientSecret':
        try {
          const { email } = data || {};
          
          // Crear SetupIntent con configuración básica
          const setupIntent = await stripe.setupIntents.create({
            payment_method_types: ['card'],
            usage: 'off_session',
            ...(email && {
              customer: await getOrCreateCustomer(email)
            })
          });

          if (!setupIntent || !setupIntent.client_secret) {
            console.error('Failed to create SetupIntent:', setupIntent);
            throw new Error('Failed to create SetupIntent');
          }

          return NextResponse.json({ 
            clientSecret: setupIntent.client_secret
          });
        } catch (error) {
          console.error('Error creating setup intent:', error);
          const errorMessage = await handleStripeError(error);
          return NextResponse.json({ error: errorMessage }, { status: 500 });
        }

      case 'getCustomerCards':
        try {
          const { email } = data;
          if (!email) {
            return NextResponse.json({ cards: [] });
          }

          const customerId = await getOrCreateCustomer(email);
          
          const paymentMethods = await stripe.paymentMethods.list({
            customer: customerId,
            type: 'card',
          });

          return NextResponse.json({ 
            cards: paymentMethods.data,
            customerId 
          });
        } catch (error) {
          console.error('Error getting customer cards:', error);
          const errorMessage = await handleStripeError(error);
          return NextResponse.json({ error: errorMessage }, { status: 500 });
        }

      case 'disconnectCard':
        try {
          const { cardId } = data;
          if (!cardId) {
            return NextResponse.json({ error: 'ID de tarjeta no proporcionado' }, { status: 400 });
          }

          await stripe.paymentMethods.detach(cardId);
          
          return NextResponse.json({ success: true });
        } catch (error) {
          console.error('Error disconnecting card:', error);
          const errorMessage = await handleStripeError(error);
          return NextResponse.json({ error: errorMessage }, { status: 500 });
        }

      case 'getPaymentMethod':
        try {
          const { paymentMethodId } = data;
          if (!paymentMethodId) {
            return NextResponse.json({ error: 'ID del método de pago no proporcionado' }, { status: 400 });
          }

          const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
          
          return NextResponse.json({ 
            paymentMethod: {
              id: paymentMethod.id,
              brand: paymentMethod.card?.brand || 'unknown',
              last4: paymentMethod.card?.last4 || '****',
              expMonth: paymentMethod.card?.exp_month || 0,
              expYear: paymentMethod.card?.exp_year || 0,
              cardType: paymentMethod.card?.funding || 'unknown',
              country: paymentMethod.card?.country || 'unknown',
              name: paymentMethod.billing_details?.name || null
            }
          });
        } catch (error) {
          console.error('Error getting payment method:', error);
          const errorMessage = await handleStripeError(error);
          return NextResponse.json({ error: errorMessage }, { status: 500 });
        }

      default:
        return NextResponse.json(
          { error: 'Acción no soportada' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error parsing request:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 400 }
    );
  }
}

async function getOrCreateCustomer(email: string): Promise<string> {
  try {
    // Buscar cliente existente
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1
    });

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0].id;
    }

    // Crear nuevo cliente
    const customer = await stripe.customers.create({
      email: email
    });

    return customer.id;
  } catch (error) {
    console.error('Error in getOrCreateCustomer:', error);
    throw error;
  }
} 