import React, { useState, useCallback, useEffect } from "react";
import axios from 'axios'; // Make sure to install axios using npm install axios

const IconList = ({ counts, onTotalDamage }) => {
  const [icons, setIcons] = useState([]);
  const [isRemoving, setIsRemoving] = useState(false);

  const availableIcons = ["🔥", "🧊", "🌪️", "🍀", "🌟"];
  const iconColors = {
    "🔥": "bg-orange-300",
    "🧊": "bg-blue-200",
    "🌪️": "bg-slate-400",
    "🍀": "bg-green-200",
    "🌟": "bg-gradient-to-r from-purple-400 via-blue-700 to-purple-400",
  };

  const iconDamage = {
    "🔥": 10,
    "🧊": 12,
    "🌪️": 18,
    "🍀": 14,
    "🌟": 25,
  };

  const MAX_ICONS = 8;
  const axios = require('axios');

  // Accumulate icons based on counts
  useEffect(() => {
    const newIcons = Object.entries(counts).reduce((acc, [key, value], index) => {
      for (let i = 0; i < value; i++) {
        if (acc.length < MAX_ICONS) {
          acc.push({
            id: Date.now() + index * value + i, // Unique ID for each icon
            name: availableIcons[index],
          });
        }
      }
      return acc;
    }, []);

    setIcons(prevIcons => {
      const combinedIcons = [...prevIcons, ...newIcons];
      return combinedIcons.slice(0, MAX_ICONS); // Ensure no more than MAX_ICONS
    });
  }, [counts]); // Run whenever counts changes

  const removeAllIcons = useCallback(() => {
    const totalDamage = icons.reduce(
      (acc, icon) => acc + iconDamage[icon.name],
      0
    );
    onTotalDamage(totalDamage);
    writeDamageInfotoFile(totalDamage); // Call the function to write to the file
    setIsRemoving(true);
    setTimeout(() => {
      setIcons([]);
      setIsRemoving(false);
    }, 600);
  }, [icons, onTotalDamage]);



  const writeDamageInfotoFile = async (damage) => {
    try {
      const response = await axios.post('http://localhost:5000/read_damage', {
        totalDamage: damage  // Send totalDamage as part of the request body
      });
      console.log('Damage info sent to backend, response:', response.data);
    } catch (error) {
      console.error('Error sending damage info to backend:', error);
    }
  };

  const handleJoyConInput = useCallback(() => {
    const gamepads = navigator.getGamepads();
    const joyCon = gamepads[0];
    if (joyCon) {
      if (joyCon.buttons[0]?.pressed && icons.length > 0) {
        removeAllIcons();
      }
    }
  }, [icons, removeAllIcons]);

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
    }, 100);
    return () => {
      window.removeEventListener("gamepadconnected", onGamepadConnected);
      window.removeEventListener("gamepaddisconnected", onGamepadDisconnected);
      clearInterval(interval);
    };
  }, [handleJoyConInput]);

  return (
    <div className="w-full flex flex-col items-center gap-4 p-4">
      <div
        className={`w-full grid grid-cols-8 gap-2 p-4 rounded-lg min-h-[100px] bg-none ${
          isRemoving ? "animate-boom" : ""
        }`}
      >
        {Array(MAX_ICONS)
          .fill(null)
          .map((_, index) => {
            const icon = icons[index];
            return (
              <div
                key={index}
                className={`flex items-center justify-center aspect-square rounded-lg border-4 border-slate-800 drop-shadow-[6px_6px_0px_rgba(0,0,0,0.8)] transition-all duration-200 ${
                  icon ? iconColors[icon.name] : "bg-gray-200"
                } ${icon?.name === "🌟" ? "rainbow-shine" : ""} ${
                  isRemoving ? "boom-effect" : ""
                }`}
              >
                {icon && <span className="icon text-4xl">{icon.name}</span>}
              </div>
            );
          })}
      </div>
      <div
        className={`mt-2 px-3 py-1 rounded-full text-sm border-4 border-slate-900 drop-shadow-[3px_3px_0px_rgba(0,0,0,0.8)] ${
          icons.length === MAX_ICONS
            ? "bg-red-500 text-white"
            : "bg-gray-100 text-gray-700"
        } transition-colors duration-300 text-lg`}
      >
        Icons: {icons.length} / {MAX_ICONS}
      </div>
      <style jsx>{`
        @keyframes rainbow-shine {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
        .rainbow-shine {
          background-size: 200% 200%;
          animation: rainbow-shine 1.5s ease infinite;
        }

        @keyframes boom {
          0% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1.5) rotate(15deg);
            opacity: 1;
          }
          100% {
            transform: scale(0) rotate(45deg);
            opacity: 0;
          }
        }

        .boom-effect {
          animation: boom 0.6s forwards;
        }
      `}</style>
    </div>
  );
};

export default IconList;
