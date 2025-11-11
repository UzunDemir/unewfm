export default function handler(req, res) {
  const playlist = [
    { file: '/track1.mp3', duration: 180 },
    { file: '/track2.mp3', duration: 210 },
  ];

  const serverStart = new Date('2025-01-01T00:00:00Z').getTime();
  const now = Date.now();
  const elapsed = Math.floor((now - serverStart) / 1000);

  let total = 0;
  let currentIndex = 0;
  let currentPos = 0;

  for (let i = 0; i < playlist.length; i++) {
    total += playlist[i].duration;
    if (elapsed % total < playlist[i].duration) {
      currentIndex = i;
      currentPos = elapsed % total;
      break;
    }
  }

  res.status(200).json({
    track: playlist[currentIndex].file,
    position: currentPos,
    serverTime: now,
  });
}
