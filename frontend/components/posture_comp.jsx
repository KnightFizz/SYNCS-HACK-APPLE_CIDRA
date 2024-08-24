import React from "react";
import WebcamLoader from "./WebcamLoader.jsx";
import ReactPlayer from "react-player";

const PostureComp = () => {
  const gridImages = [
    { id: 1, src: "/Resources/GIF/Squat_Update.gif", alt: "Posture 1" },
    { id: 2, src: "/Resources/GIF/Curl.gif", alt: "Posture 2" },
    { id: 3, src: "/Resources/GIF/LatRise.gif", alt: "Posture 3" },
    { id: 4, src: "/api/placeholder/100/100", alt: "Posture 4" },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 bg-gray-300 flex items-center justify-center mb-4 border-4 rounded-sm border-slate-800 max-h-72 overflow-hidden"></div>

      {/* Grid view */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-2 text-center">
          Posture Guide
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {gridImages.map((image) => (
            <div
              key={image.id}
              className="bg-none aspect-square flex items-center justify-center drop-shadow-[5px_0px_0px_rgba(0,0,0,0.8)]"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="max-w-full max-h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostureComp;
