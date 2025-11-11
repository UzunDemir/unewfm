import { NodeID3 } from 'node-id3'; // Для парсинга ID3 тегов

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Получаем информацию о текущем треке из основного потока
      const streamResponse = await fetch(`${process.env.VERCEL_URL}/api/stream`);
      const streamInfo = await streamResponse.json();

      // Парсим ID3 теги для локальных файлов
      let trackInfo = { ...streamInfo };
      
      if (streamInfo.trackPath) {
        try {
          const tags = await NodeID3.read(streamInfo.trackPath);
          if (tags.title) trackInfo.title = tags.title;
          if (tags.artist) trackInfo.artist = tags.artist;
          if (tags.album) trackInfo.album = tags.album;
          if (tags.image) trackInfo.cover = tags.image;
        } catch (error) {
          console.log('ID3 parsing failed, using default info');
        }
      }

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json(trackInfo);

    } catch (error) {
      res.status(500).json({ error: 'Failed to get current track info' });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
