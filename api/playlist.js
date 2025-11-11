let playlist = [
  {
    id: 1,
    title: "Summer Vibes",
    artist: "Ocean Waves", 
    duration: 180,
    url: "/tracks/track1.mp3",
    type: "local"
  },
  {
    id: 2,
    title: "Night Drive", 
    artist: "Synth Masters",
    duration: 240,
    url: "https://example.com/track2.mp3",
    type: "url"
  }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(playlist);
  }
  
  if (req.method === 'POST') {
    const { title, artist, duration, url, type } = req.body;
    
    const newTrack = {
      id: playlist.length + 1,
      title,
      artist,
      duration: parseInt(duration),
      url,
      type: type || (url.startsWith('http') ? 'url' : 'local')
    };
    
    playlist.push(newTrack);
    return res.status(201).json(newTrack);
  }
  
  res.status(405).json({ error: 'Method not allowed' });
}
