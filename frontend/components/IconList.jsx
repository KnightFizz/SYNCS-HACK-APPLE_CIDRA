import React, { useState, useCallback } from "react";

const IconList = () => {
  const [icons, setIcons] = useState([]);
  const availableIcons = ["🔥", "🧊", "🌪️", "💫"];

  const addRandomIcon = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * availableIcons.length);
    const newIcon = {
      id: Date.now(),
      name: availableIcons[randomIndex],
    };
    setIcons((prevIcons) => [...prevIcons, newIcon]);
  }, []);

  const handleRemoveIcon = (id) => {
    setIcons((prevIcons) => prevIcons.filter((icon) => icon.id !== id));
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-100 rounded-lg">
      <div
        className="flex flex-wrap gap-2 p-4 bg-white rounded-lg shadow-md cursor-pointer min-h-[100px] min-w-[200px] justify-center items-center"
        onClick={addRandomIcon}
      >
        {icons.map((icon) => (
          <div
            key={icon.id}
            className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full shadow hover:bg-gray-200 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling
              handleRemoveIcon(icon.id);
            }}
          >
            <span className="icon text-2xl">{icon.name}</span>
          </div>
        ))}
        {icons.length === 0 && (
          <p className="text-gray-400">Click to add an icon</p>
        )}
      </div>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
        onClick={addRandomIcon}
      >
        Add Random Icon
      </button>
    </div>
  );
};

export default IconList;
