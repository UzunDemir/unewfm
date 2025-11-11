let currentState = {
  currentTrack: 0,
  startTime: Date.now(),
  isPlaying: true,
  playlist: [
    {
      id: 1,
      title: "Трек 1",
      artist: "Исполнитель 1",
      duration: 180,
      url: "/tracks/track1.mp3"
    },
    {
      id: 2, 
      title: "Трек 2",
      artist: "Исполнитель 2", 
      duration: 240,
      url: "/tracks/track2.mp3"
    }
  ]
};

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Возвращаем текущее состояние
    const elapsed = Date.now() - currentState.startTime;
    const response = {
      ...currentState,
      currentTime: elapsed / 1000,
      listeners: Math.floor(Math.random() * 100) + 50 // Имитация слушателей
    };
    
    return res.status(200).json(response);
  }
  
  if (req.method === 'POST') {
    // Админ: изменение состояния
    const { action, trackIndex } = req.body;
    
    if (action === 'play') {
      currentState.isPlaying = true;
      currentState.startTime = Date.now() - (req.body.currentTime || 0) * 1000;
    } else if (action === 'pause') {
      currentState.isPlaying = false;
    } else if (action === 'change_track' && trackIndex !== undefined) {
      currentState.currentTrack = trackIndex;
      currentState.startTime = Date.now();
      currentState.isPlaying = true;
    }
    
    return res.status(200).json({ success: true });
  }
  
  res.status(405).json({ error: 'Method not allowed' });
}
