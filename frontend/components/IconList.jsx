import React, { useState, useCallback, useEffect } from "react";

const IconList = () => {
  const [icons, setIcons] = useState([]);
  const availableIcons = ["🔥", "🧊", "🌪️", "💫"];
  const iconColors = {
    "🔥": "bg-red-600",
    "🧊": "bg-blue-600",
    "🌪️": "bg-gray-600",
    "💫": "bg-yellow-600",
  };
  const [selectedIndex, setSelectedIndex] = useState(0);
  const MAX_ICONS = 8;

  const addRandomIcon = useCallback(() => {
    if (icons.length < MAX_ICONS) {
      const randomIndex = Math.floor(Math.random() * availableIcons.length);
      const newIcon = {
        id: Date.now(),
        name: availableIcons[randomIndex],
      };
      setIcons((prevIcons) => [...prevIcons, newIcon]);
    }
  }, [icons]);

  const removeAllIcons = useCallback(() => {
    setIcons([]);
    setSelectedIndex(0);
  }, []);

  const handleJoyConInput = useCallback(() => {
    const gamepads = navigator.getGamepads();
    const joyCon = gamepads[0]; // Assuming the Joy-Con is the first connected gamepad
    if (joyCon) {
      // A Button (Select/Remove All)
      if (joyCon.buttons[0]?.pressed && icons.length > 0) {
        removeAllIcons();
      }
      // B Button (Add Icon)
      if (joyCon.buttons[1]?.pressed) {
        addRandomIcon();
      }
    }
  }, [icons, selectedIndex, addRandomIcon, removeAllIcons]);

  useEffect(() => {
    const onGamepadConnected = () => {
      console.log("Gamepad connected");
    };
    const onGamepadDisconnected = () => {
      console.log("Gamepad disconnected");
    };
    window.addEventListener("gamepadconnected", onGamepadConnected);
    window.addEventListener("gamepaddisconnected", onGamepadDisconnected);

    const interval = setInterval(() => {
      handleJoyConInput();
    }, 100); // Check every 100ms

    return () => {
      window.removeEventListener("gamepadconnected", onGamepadConnected);
      window.removeEventListener("gamepaddisconnected", onGamepadDisconnected);
      clearInterval(interval);
    };
  }, [handleJoyConInput]);

  return (
    <div className="w-full flex flex-col items-center gap-4 p-4">
      <div className="w-full grid grid-cols-8 gap-2 p-4 rounded-lg min-h-[100px] bg-none">
        {icons.map((icon, index) => (
          <div
          key={icon.id}
          className={`flex items-center justify-center aspect-square rounded-lg border-4 border-slate-800 drop-shadow-[6px_6px_0px_rgba(0,0,0,0.8)] transition-all duration-200 ${
            iconColors[icon.name]
          }`}
        >
            <span className="icon text-4xl">{icon.name}</span>
          </div>
        ))}
        {Array(MAX_ICONS - icons.length)
          .fill(null)
          .map((_, index) => (
            <div
              key={`empty-${index}`}
              className="aspect-square rounded-lg bg-gray-200 border-4 border-slate-800 drop-shadow-[3px_3px_0px_rgba(0,0,0,0.8)]"
            />
          ))}
      </div>
      <div
        className={`mt-2 px-3 py-1 rounded-full text-sm ${
          icons.length === MAX_ICONS
            ? "bg-red-500 text-white"
            : "bg-gray-200 text-gray-700"
        } transition-colors duration-300`}
      >
        Icons: {icons.length} / {MAX_ICONS}
      </div>
    </div>
  );
};

export default IconList;
