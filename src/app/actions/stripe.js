'use server'

export async function fetchClientSecret(email) {
  try {
    const response = await fetch(new URL('/api/stripe', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'fetchClientSecret',
        data: { email }
      }),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from server:', errorData);
      throw new Error(errorData.error || 'Error al procesar la solicitud');
    }

    const data = await response.json();
    
    if (!data.clientSecret) {
      console.error('No client secret received:', data);
      throw new Error('No se recibió el client secret');
    }

    return data.clientSecret;
  } catch (error) {
    console.error('Error in fetchClientSecret:', error);
    throw new Error('Error al inicializar el formulario de pago');
  }
}

export async function getCustomerCards(email) {
  try {
    if (!email) {
      console.log('No email provided, returning empty array')
      return []
    }

    const response = await fetch(new URL('/api/stripe', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'getCustomerCards',
        data: { email }
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al cargar las tarjetas')
    }

    const data = await response.json()
    return data.cards.map(pm => ({
      id: pm.id,
      brand: pm.card.brand,
      last4: pm.card.last4,
      expMonth: pm.card.exp_month,
      expYear: pm.card.exp_year
    }))
  } catch (error) {
    console.error('Error in getCustomerCards:', error)
    throw error
  }
}