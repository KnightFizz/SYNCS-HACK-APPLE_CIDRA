import { useState } from 'react';

const WebcamLoader = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto bg-black rounded-xl overflow-hidden shadow-lg">
      {/* Video Stream */}
      {error ? (
        <div className="flex flex-col items-center justify-center p-10 bg-red-500 text-white">
          <p className="text-xl font-bold">Unable to load the webcam feed</p>
          <p className="text-sm">Please try again later.</p>
        </div>
      ) : (
        <img
          // Only for testing
          // TODO: fix with Live Stream Error
          src="https://www.youtube.com/live/Vg13S-zzol0?si=8veHvAWMhCNm01Wr"
          // src="http://127.0.0.1:5000/video_feed"
          alt="Video Stream"
          className={`w-full transition-opacity duration-500 ease-in-out ${
            loading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* Loading Spinner */}
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="loader border-4 border-t-4 border-gray-300 border-t-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default WebcamLoader;
