import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const audioRef = useRef(null);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const sync = async () => {
      const res = await fetch('/api/current');
      const data = await res.json();
      setInfo(data);

      if (audioRef.current) {
        audioRef.current.src = data.track;
        audioRef.current.currentTime = data.position;
        await audioRef.current.play();
      }
    };
    sync();

    // Обновлять раз в 30 сек для синхронизации
    const interval = setInterval(sync, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">🎵 My Synced Radio</h1>
      <audio ref={audioRef} controls autoPlay />
      {info && (
        <p className="mt-4 text-gray-600">
          Сейчас играет: {info.track}, позиция {Math.floor(info.position)} с
        </p>
      )}
    </main>
  );
}
