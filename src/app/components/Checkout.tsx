'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import { fetchClientSecret } from '../actions/stripe';
import type { Appearance } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/return`
        }
      });

      if (submitError) {
        setError(submitError.message || 'Error al procesar la tarjeta');
        return;
      }

      onSuccess();
    } catch (err) {
      setError('Error al procesar la tarjeta. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="w-full">
        <PaymentElement
          options={{
            layout: 'tabs',
            fields: {
              billingDetails: {
                email: 'never',
                phone: 'never',
                address: 'never'
              }
            },
            wallets: {
              applePay: 'never',
              googlePay: 'never'
            }
          }}
          className="w-full [&_*]:!max-w-full [&_iframe]:!w-full"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !stripe}
        className={`
          w-full py-3 px-4 rounded-lg text-white font-medium
          ${loading || !stripe
            ? 'bg-blue-600/50 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 transition-colors'
          }
        `}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            Procesando...
          </div>
        ) : (
          'Guardar Tarjeta'
        )}
      </button>
    </form>
  );
}

export default function Checkout({ onSuccess }: { onSuccess: () => void }) {
  const [clientSecret, setClientSecret] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const secret = await fetchClientSecret();
        setClientSecret(secret);
      } catch (err) {
        setError('Error al inicializar el formulario de pago');
      }
    };

    initializePayment();
  }, []);

  if (error) {
    return (
      <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const appearance: Appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#3b82f6',
      colorBackground: '#1e293b',
      colorText: '#fff',
      colorDanger: '#ef4444',
      colorTextSecondary: '#94a3b8',
      borderRadius: '8px',
      fontFamily: 'system-ui, sans-serif',
      fontSizeBase: '16px',
      spacingUnit: '4px',
      fontWeightNormal: '400',
      fontWeightMedium: '500',
      fontWeightBold: '600',
    },
    rules: {
      '.Tab': {
        backgroundColor: '#101829',
        border: '1px solid #1e293b',
      },
      '.Tab:hover': {
        backgroundColor: '#1e293b',
      },
      '.Tab--selected': {
        backgroundColor: '#1e293b',
        borderColor: '#3b82f6',
      },
      '.Label': {
        color: '#94a3b8',
      },
      '.Input': {
        backgroundColor: '#1e293b',
        borderColor: '#334155',
        maxWidth: '100%'
      },
      '.Input:focus': {
        borderColor: '#3b82f6',
      },
      '.Input--invalid': {
        borderColor: '#ef4444',
      }
    }
  };

  return (
    <Elements 
      stripe={stripePromise} 
      options={{ 
        clientSecret, 
        appearance,
        loader: 'auto'
      }}
    >
      <CheckoutForm onSuccess={onSuccess} />
    </Elements>
  );
}