// api/radio.js
let radioState = {
  currentSongIndex: 0,
  playlist: [],
  startTime: Date.now(),
  isPlaying: true
};

// Инициализируем плейлист при старте
const initialPlaylist = [
  {
    id: 1,
    title: 'Electronic Dreams',
    artist: 'AI Composer',
    duration: 180, // 3 минуты
    file: '/audio/1.mp3'
  },
  {
    id: 2, 
    title: 'Digital Sunrise',
    artist: 'Synth Master',
    duration: 240, // 4 минуты
    file: '/audio/2.mp3'
  }
];

// Устанавливаем начальный плейлист
radioState.playlist = initialPlaylist;

export default function handler(req, res) {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const now = Date.now();
    const currentSong = radioState.playlist[radioState.currentSongIndex];
    
    if (!currentSong) {
      return res.json({ error: 'No songs in playlist' });
    }

    // Рассчитываем прогресс
    const progress = (now - radioState.startTime) / 1000; // в секундах
    const progressPercent = Math.min(100, (progress / currentSong.duration) * 100);
    
    // Проверяем是否需要 перейти к следующей песне
    if (progress >= currentSong.duration) {
      radioState.currentSongIndex = (radioState.currentSongIndex + 1) % radioState.playlist.length;
      radioState.startTime = now;
      
      // Обновляем текущую песню после перехода
      const newCurrentSong = radioState.playlist[radioState.currentSongIndex];
      const newProgress = 0;
      
      return res.json({
        currentSong: newCurrentSong,
        progress: newProgress,
        progressPercent: 0,
        songIndex: radioState.currentSongIndex,
        timeRemaining: newCurrentSong.duration
      });
    }

    res.json({
      currentSong: currentSong,
      progress: Math.floor(progress),
      progressPercent: Math.floor(progressPercent),
      songIndex: radioState.currentSongIndex,
      timeRemaining: Math.floor(currentSong.duration - progress)
    });
  }

  if (req.method === 'POST') {
    // Обновление состояния из бота
    const { playlist, currentSongIndex, startTime } = req.body;
    
    if (playlist) radioState.playlist = playlist;
    if (currentSongIndex !== undefined) radioState.currentSongIndex = currentSongIndex;
    if (startTime) radioState.startTime = startTime;
    
    res.json({ 
      status: 'success', 
      message: 'Radio state updated',
      state: radioState 
    });
  }
}
