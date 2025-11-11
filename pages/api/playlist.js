export default function handler(req, res) {
  const now = Date.now();
  const start1 = new Date(now + 10000);
  const start2 = new Date(now + 40000);
  res.status(200).json({
    tracks: [
      { id: 't1', title: 'Track 1', url: '/track1.mp3', start_iso: start1.toISOString() },
      { id: 't2', title: 'Track 2', url: '/track2.mp3', start_iso: start2.toISOString() },
    ],
  });
}
