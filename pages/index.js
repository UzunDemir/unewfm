import { useEffect, useRef, useState } from "react";

export default function Radio() {
  const audioRef = useRef();
  const [track, setTrack] = useState(null);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    async function fetchTrack() {
      const res = await fetch("/api/currentTrack");
      const data = await res.json();
      setTrack(`/songs/${data.track}`);
      setStartTime(data.startTimestamp);
    }

    fetchTrack();
    const interval = setInterval(fetchTrack, 5000); // проверяем каждые 5 секунд
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (track && startTime && audioRef.current) {
      const now = Math.floor(Date.now() / 1000);
      const offset = now - startTime;
      audioRef.current.currentTime = offset;
      audioRef.current.play();
    }
  }, [track, startTime]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Синхронное Онлайн-Радио</h1>
      {track ? (
        <audio ref={audioRef} src={track} controls autoPlay />
      ) : (
        <p>Загрузка радио...</p>
      )}
    </div>
  );
}
