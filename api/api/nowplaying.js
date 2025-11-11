// api/nowplaying.js
import radioState from './radio.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  if (req.method === 'GET') {
    const now = Date.now();
    const currentSong = radioState.playlist[radioState.currentSongIndex];
    
    if (!currentSong) {
      return res.json({ error: 'No songs in playlist' });
    }

    const progress = (now - radioState.startTime) / 1000;
    const progressPercent = Math.min(100, (progress / currentSong.duration) * 100);

    res.json({
      song: currentSong,
      progress: Math.floor(progress),
      progressPercent: Math.floor(progressPercent),
      timeRemaining: Math.floor(currentSong.duration - progress)
    });
  }
}
