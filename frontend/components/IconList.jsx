import React, { useState, useCallback, useEffect } from "react";

const IconList = () => {
  const [icons, setIcons] = useState([]);
  const availableIcons = ["🔥", "🧊", "🌪️", "💫"];
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  const handleJoyConInput = useCallback(() => {
    const gamepads = navigator.getGamepads();
    const joyCon = gamepads[0]; // Assuming the Joy-Con is the first connected gamepad

    if (joyCon) {
      // D-Pad Right
      if (joyCon.buttons[15]?.pressed) {
        setSelectedIndex((prevIndex) =>
          prevIndex < icons.length - 1 ? prevIndex + 1 : 0
        );
      }

      // D-Pad Left
      if (joyCon.buttons[14]?.pressed) {
        setSelectedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : icons.length - 1
        );
      }

      // A Button (Select/Remove)
      if (joyCon.buttons[0]?.pressed && icons.length > 0) {
        handleRemoveIcon(icons[selectedIndex].id);
      }

      // B Button (Add Icon)
      if (joyCon.buttons[1]?.pressed) {
        addRandomIcon();
      }
    }
  }, [icons, selectedIndex, addRandomIcon]);

  useEffect(() => {
    // Log connection events
    const onGamepadConnected = () => {
      console.log("Gamepad connected");
    };

    const onGamepadDisconnected = () => {
      console.log("Gamepad disconnected");
    };

    window.addEventListener("gamepadconnected", onGamepadConnected);
    window.addEventListener("gamepaddisconnected", onGamepadDisconnected);

    // Poll for gamepad input
    const interval = setInterval(() => {
      handleJoyConInput();
    }, 100); // Check every 100ms

    // Cleanup
    return () => {
      window.removeEventListener("gamepadconnected", onGamepadConnected);
      window.removeEventListener("gamepaddisconnected", onGamepadDisconnected);
      clearInterval(interval);
    };
  }, [handleJoyConInput]);
  
  return (
    <div className="flex flex-col items-center gap-4 p-4 rounded-lg">
      <div
        className="flex flex-wrap gap-2 p-4 rounded-lg cursor-pointer min-h-[100px] min-w-[200px] justify-center items-center"
        onClick={addRandomIcon}
      >
        {icons.map((icon) => (
          <div
            key={icon.id}
            className="flex items-center justify-center w-20 h-20 rounded-lg bg-cyan-200 hover:rounded-3xl hover:bg-gray-800 transition-all duration-200"
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
