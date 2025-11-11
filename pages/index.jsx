export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">🎧 My Live Radio</h1>
      <audio
        src="https://your-stream-url/live"
        controls
        autoPlay
      />
      <p className="mt-4 text-gray-500">
        Live stream — all listeners hear the same audio.
      </p>
    </main>
  );
}
