import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex justify-around items-center min-h-screen w-[90%] space-x-16">
      <div className="flex flex-col w-[50%] space-y-10 " >
        <h1 className="text-white font-sans font-bold text-8xl mb-4">AxoPay</h1>
        <h2 className="text-blue-200 font-sans font-light text-5xl " >Seguridad y simplicidad en cada transacción.</h2>
        <p className="text-white text-xl " >Respaldado por MXNB, lideramos una nueva forma de mover dinero: pagos con QR seguros, transferencias masivas eficientes y recompensas por cada transacción. Todo, sin bancos, sin fricción y al alcance de todos.</p>
      </div>
      <div>
        <Image src="/AxoCoin.png" alt="AxoCoin logo" width={384} height={384} className="h-96 w-96" />
      </div>
    </div>
  );
}
