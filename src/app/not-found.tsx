export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-orange-50">
      <div className="text-center">
        <div className="text-8xl mb-4">🧠</div>
        <h1 className="font-nunito text-3xl font-black text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-6">This quest hasn't been unlocked yet!</p>
        <a href="/" className="bg-purple-600 text-white font-bold py-3 px-6 rounded-2xl hover:bg-purple-700 transition-all">
          Return Home
        </a>
      </div>
    </div>
  );
}
