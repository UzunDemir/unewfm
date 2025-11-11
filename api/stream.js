import fs from 'fs';
import path from 'path';

// Расписание (8:00 - начало вещания)
const SCHEDULE_START = 8 * 60 * 60 * 1000; // 8:00 в миллисекундах

class RadioStream {
  constructor() {
    this.playlist = [];
    this.currentTrackIndex = 0;
    this.streamStartTime = Date.now();
    this.isPlaying = true;
    this.loadPlaylist();
  }

  loadPlaylist() {
    // Локальные файлы
    const localTracks = [
      {
        path: 'https://musify.club/track/pl/110489/c-c-catch-one-night-is-not-enough.mp3',
        title: 'Unknown',
        artist: 'Unknown',
        duration: 180
      },
      {
        path: '/tracks/track2.mp3', 
        title: 'Unknown',
        artist: 'Unknown',
        duration: 240
      }
    ];

    // Внешние ссылки
    const urlTracks = [
      {
        url: 'https://example.com/track3.mp3',
        title: 'External Track 1',
        artist: 'External Artist',
        duration: 200
      }
    ];

    this.playlist = [...localTracks, ...urlTracks];
  }

  getCurrentTrack() {
    const now = Date.now();
    const elapsed = now - this.streamStartTime;
    let totalDuration = 0;

    // Находим текущий трек based on elapsed time
    for (let i = 0; i < this.playlist.length; i++) {
      totalDuration += this.playlist[i].duration * 1000;
      if (elapsed < totalDuration) {
        return {
          track: this.playlist[i],
          index: i,
          position: elapsed - (totalDuration - this.playlist[i].duration * 1000)
        };
      }
    }

    // Если плейлист закончился - начинаем заново
    this.streamStartTime = now;
    return this.getCurrentTrack();
  }

  getStreamInfo() {
    const current = this.getCurrentTrack();
    const track = current.track;
    
    return {
      title: track.title,
      artist: track.artist,
      duration: track.duration,
      currentTime: Math.floor(current.position / 1000),
      trackIndex: current.index,
      listeners: Math.floor(Math.random() * 100) + 50,
      isPlaying: this.isPlaying
    };
  }
}

const radio = new RadioStream();

export default function handler(req, res) {
  if (req.method === 'GET') {
    const info = radio.getStreamInfo();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    
    return res.status(200).json(info);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
