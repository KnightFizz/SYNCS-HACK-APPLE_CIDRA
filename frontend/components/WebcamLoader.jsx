import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';


const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

const WebcamLoader = () => {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsClient(true); // This ensures the component only renders on the client
  }, []);

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
      ) : isClient ? (
          <ReactPlayer
            url="https://www.youtube.com/watch?v=jfKfPfyJRdkh"
            onReady={handleLoad}
            onError={handleError}
            playing={true} // Probably not using Youtube we can remove those two lines
            controls={false} // Probably not using Youtube we can remove those two lines
            volume={0}
            mute={true}
          />
      ) : null}

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