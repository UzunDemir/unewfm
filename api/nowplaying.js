// api/nowplaying.js
export default function handler(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }
  
  if (request.method === 'GET') {
    // Простой ответ для теста
    return response.status(200).json({
      currentSong: {
        id: 1,
        title: "Test Song",
        artist: "Test Artist", 
        duration: 180,
        file: "/audio/1.mp3"
      },
      progress: 60,
      progressPercent: 33,
      songIndex: 0,
      timeRemaining: 120,
      message: "nowplaying endpoint works!"
    });
  }
  
  return response.status(405).json({ error: 'Method not allowed' });
}
