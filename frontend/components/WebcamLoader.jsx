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
      ) : < img src="http://127.0.0.1:5000/video_feed" alt="Video Stream" />}
      
    </div>
  );
};

export default WebcamLoader;