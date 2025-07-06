'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Checkout from '../../components/Checkout';
import Modal from '../../components/Modal';
import SavedCards from '../../components/SavedCards';
import { getCustomerCards, disconnectCard } from '../../actions/stripe';

interface Card {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  cardType: string;
  country: string;
  name: string | null;
}

export default function User() {
  const { user, logout } = usePrivy();
  const router = useRouter();
  const walletAddress = user?.wallet?.address || '';
  const [copied, setCopied] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCards = async () => {
    if (!user?.email) return;
    try {
      setIsLoading(true);
      const loadedCards = await getCustomerCards(user.email.toString());
      setCards(loadedCards);
    } catch (err) {
      console.error('Error loading cards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      loadCards();
    }
  }, [user?.email]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSuccess = async (paymentMethod: any) => {
    setShowCheckout(false);
    if (paymentMethod) {
      setCards(prevCards => [...prevCards, paymentMethod]);
      await loadCards();
    }
  };

  const handleDisconnectCard = async (cardId: string) => {
    try {
      await disconnectCard(cardId);
      await loadCards();
    } catch (error) {
      console.error('Error al desconectar la tarjeta:', error);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0F1C] text-white pt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <div className="bg-[#101829] p-7 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-20 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
          </div>

          <div className="flex justify-center items-start gap-8">
            {/* Card de Wallet */}
            <div className="bg-[#101829] rounded-2xl p-6 w-[45%]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Image src="/wallet.svg" alt="" width={24} height={24} />
                  <h3 className="text-white font-semibold text-lg">Mi Wallet</h3>
                </div>
              </div>

              <div className="bg-[#0A0F1C] rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Dirección</span>
                  <button
                    onClick={copyAddress}
                    className="text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <Image src="/copiar.svg" alt="Copiar" width={20} height={20} />
                  </button>
                </div>
                <p className="text-sm font-mono mt-1 break-all">
                  {walletAddress || 'No wallet connected'}
                </p>
                {copied && (
                  <span className="text-green-500 text-sm block mt-1">¡Copiado!</span>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition w-full"
              >
                Cerrar Sesión
              </button>
            </div>

            {/* Card de Tarjetas */}
            <div className="bg-[#101829] rounded-2xl p-6 w-[45%]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Image src="/file.svg" alt="" width={24} height={24} />
                  <h3 className="text-white font-semibold text-lg">Mis Tarjetas</h3>
                </div>
              </div>

              {cards.length > 0 ? (
                <SavedCards cards={cards} onDisconnect={handleDisconnectCard} />
              ) : (
                <div className="text-center p-4">
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition w-full"
                  >
                    Conectar Tarjeta
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        title="Agregar Nueva Tarjeta"
      >
        <div className="w-full min-h-[400px]">
          <Checkout onSuccess={handleSuccess} email={user?.email?.toString()} />
        </div>
      </Modal>
    </main>
  );
} 