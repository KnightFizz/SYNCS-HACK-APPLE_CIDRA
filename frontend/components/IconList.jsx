import React, { useState, useCallback, useEffect } from "react";

const IconList = () => {
  const [icons, setIcons] = useState([]);
  const [isRemoving, setIsRemoving] = useState(false); // State to trigger the boom effect
  const availableIcons = ["🔥", "🧊", "🌪️", "🍀", "🌟"];
  const iconColors = {
    "🔥": "bg-orange-300",
    "🧊": "bg-blue-200",
    "🌪️": "bg-slate-400",
    "🍀": "bg-green-200",
    "🌟": "bg-gradient-to-r from-purple-400 via-blue-700 to-purple-400",
  };

  const iconDamage = {
    "🔥": 15,
    "🧊": 12,
    "🌪️": 20,
    "🍀": 15,
    "🌟": 30,
  };

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
    setIsRemoving(true); // Trigger the boom effect
    setTimeout(() => {
      setIcons([]); // Remove all icons after the animation
      setIsRemoving(false); // Reset the removing state
    }, 600); // Duration matches the CSS animation time
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
  }, [icons, addRandomIcon, removeAllIcons]);

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
