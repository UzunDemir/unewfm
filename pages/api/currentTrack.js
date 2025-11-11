export default function handler(req, res) {
  const playlist = ["song1.mp3", "song2.mp3", "song3.mp3"];
  const trackDuration = 120; // секунд, длина каждого трека
  const startTime = 1700000000; // начало плейлиста в UNIX
  const now = Math.floor(Date.now() / 1000);

  const index = Math.floor((now - startTime) / trackDuration) % playlist.length;
  const track = playlist[index];
  const trackStart = startTime + index * trackDuration;

  res.status(200).json({
    track,
    startTimestamp: trackStart
  });
}
