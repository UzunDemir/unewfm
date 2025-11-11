// api/nowplaying.js
let radioState = {
  currentSongIndex: 0,
  playlist: [
    {
      id: 1,
      title: 'Electronic Dreams',
      artist: 'AI Composer',
      duration: 180,
      file: '/audio/1.mp3'
    },
    {
      id: 2, 
      title: 'Digital Sunrise',
      artist: 'Synth Master',
      duration: 240,
      file: '/audio/2.mp3'
    }
  ],
  startTime: Date.now()
};

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

    // Автопереход к следующей песне
    if (progress >= currentSong.duration) {
      radioState.currentSongIndex = (radioState.currentSongIndex + 1) % radioState.playlist.length;
      radioState.startTime = now;
    }

    res.json({
      currentSong: currentSong,
      progress: Math.floor(progress),
      progressPercent: Math.floor(progressPercent),
      songIndex: radioState.currentSongIndex,
      timeRemaining: Math.floor(currentSong.duration - progress)
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
