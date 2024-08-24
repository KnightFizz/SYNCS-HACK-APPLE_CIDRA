import React from "react";

const PostureComp = () => {
  const gridImages = [
    { id: 1, src: "/Resources/GIF/Squat.GIF", alt: "Posture 1" },
    { id: 2, src: "/api/placeholder/100/100", alt: "Posture 2" },
    { id: 3, src: "/api/placeholder/100/100", alt: "Posture 3" },
    { id: 4, src: "/api/placeholder/100/100", alt: "Posture 4" },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Webcam placeholder */}
      <div className="flex-1 bg-gray-300 flex items-center justify-center mb-4">
        <p className="text-lg font-semibold">Webcam Placeholder</p>
      </div>

      {/* Grid view */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-2">Posture Grid</h3>
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
