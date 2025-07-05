'use server'

export async function fetchClientSecret() {
  try {
    const response = await fetch(new URL('/api/stripe', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'fetchClientSecret'
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al procesar la solicitud')
    }

    const data = await response.json()
    return data.clientSecret
  } catch (error) {
    console.error('Error in fetchClientSecret:', error)
    throw error
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