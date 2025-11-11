import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

async function fetchServerTime() {
  const t0 = Date.now();
  const res = await fetch('/api/time');
  const server = await res.json();
  const t1 = Date.now();
  const rtt = (t1 - t0) / 2;
  const serverMs = new Date(server.now).getTime();
  return { offset: serverMs - (t0 + rtt) };
}

export default function Home() {
  const [offsetMs, setOffsetMs] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const audioRefs = useRef({});

  useEffect(() => {
    async function init() {
      const { offset } = await fetchServerTime();
      setOffsetMs(offset);
      const res = await fetch('/api/playlist');
      const data = await res.json();
      setPlaylist(data.tracks);
      for (const track of data.tracks) {
        const audio = new Audio(track.url);
        audio.preload = 'auto';
        audioRefs.current[track.id] = audio;
      }
    }
    init();
  }, []);

  const serverNow = () => Date.now() + offsetMs;

  function playTracks() {
    playlist.forEach(track => {
      const startMs = new Date(track.start_iso).getTime();
      const delay = startMs - serverNow();
      const audio = audioRefs.current[track.id];
      if (!audio) return;
      if (delay > 0) {
        setTimeout(() => audio.play(), delay);
      } else {
        audio.currentTime = (-delay) / 1000;
        audio.play();
      }
    });
  }

  return (
    <div style={{ padding: 20 }}>
      <Head><title>Radio</title></Head>
      <h1>🎵 Радио в реальном времени</h1>
      <button onClick={playTracks}>▶️ Синхронный старт</button>
      <ul>
        {playlist.map(t => (
          <li key={t.id}>
            {t.title} — старт {new Date(t.start_iso).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
