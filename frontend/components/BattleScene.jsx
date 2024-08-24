import React, { useRef, useEffect, useState } from "react";
import { createCanvas, loadImage } from "canvas";

const HPBar = ({ hp, maxHp, label, isPlayer }) => (
  <div
    className={`w-48 ${isPlayer ? "ml-4" : "mr-4"} bg-black/50 rounded-2xl p-2`}
  >
    <div className="text-white text-base font-bold mb-1">
      {label} : {hp} / {maxHp} HP
    </div>

    <div className="w-full bg-red-500 rounded-full h-4">
      <div
        className="bg-green-500 rounded-full h-4 transition-all duration-300 ease-out"
        style={{ width: `${(hp / maxHp) * 100}%` }}
      ></div>
    </div>
  </div>
);

const CanvasBattleScene = ({ totalDamage }) => {
  const canvasRef = useRef(null);
  const [playerHP, setPlayerHP] = useState(300);
  const [enemyHP, setEnemyHP] = useState(300);
  const [currentTurn, setCurrentTurn] = useState("player");
  const [playerDamaged, setPlayerDamaged] = useState(false);
  const [enemyDamaged, setEnemyDamaged] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const canvas = createCanvas(700, 390);
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const loadAssets = async () => {
      const backgroundImage = await loadImage("/Resources/bg/woodfield.webp");
      const playerImage = await loadImage("/Resources/SVG/toast.svg");
      const enemyImage = await loadImage("/Resources/SVG/egg.svg");

      const drawParticles = () => {
        particles.forEach((particle, index) => {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();

          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.size *= 0.95;

          if (particle.size < 0.5) {
            particles.splice(index, 1);
          }
        });
      };

      const drawScene = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        // Flip the playerImage horizontally and reduce its size
        ctx.save(); // Save the current context state
        ctx.scale(-1, 1); // Flip horizontally
        ctx.drawImage(playerImage, -220, canvas.height - 200, 150, 150); // Smaller size: 100x100
        ctx.restore(); // Restore the original context state

<<<<<<< HEAD
        // Draw player with damage effect
        ctx.save();
        if (playerDamaged) {
          ctx.filter = "saturate(200%) hue-rotate(150deg)";
          ctx.translate(Math.random() * 4 - 2, Math.random() * 4 - 2);
        }
        ctx.drawImage(playerImage, 80, canvas.height - 250, 200, 200);
        ctx.restore();

        // Draw enemy with damage effect
        ctx.save();
        if (enemyDamaged) {
          ctx.filter = "saturate(200%) hue-rotate(150deg)";
          ctx.translate(Math.random() * 4 - 2, Math.random() * 4 - 2);
        }
=======
        // Draw the enemy image smaller
>>>>>>> df79acf914d9d73e0a091f4edb63da9caff13cf1
        ctx.drawImage(
          enemyImage,
          canvas.width - 230,
          canvas.height - 300,
          150,  // Smaller width
          150   // Smaller height
        );
        ctx.restore();

        drawParticles();

        const onscreenCanvas = canvasRef.current;
        const onscreenCtx = onscreenCanvas.getContext("2d");
        onscreenCtx.drawImage(canvas, 0, 0);

        animationFrameId = requestAnimationFrame(drawScene);
      };

      drawScene();
    };

    loadAssets();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentTurn, playerDamaged, enemyDamaged, particles]);

  const createExplosion = (x, y, damage) => {
    const particleCount = damage > 40 ? 100 : damage > 25 ? 50 : 25;
    const explosionSize = damage > 40 ? 40 : damage > 25 ? 30 : 20;
    const colors = ["#FF0000", "#FFA500", "#FFFF00"];

    const newParticles = Array(particleCount)
      .fill()
      .map(() => ({
        x,
        y,
        size: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * explosionSize * 0.2,
        vy: (Math.random() - 0.5) * explosionSize * 0.2,
      }));

    setParticles((prevParticles) => [...prevParticles, ...newParticles]);
  };

  // Use totalDamage to reduce enemy HP and create explosion
  useEffect(() => {
    if (totalDamage > 0) {
      setEnemyHP((prev) => Math.max(0, prev - totalDamage));
      setEnemyDamaged(true);
      createExplosion(500, 140, totalDamage); // Adjust x, y to match enemy position
      setTimeout(() => setEnemyDamaged(false), 300);
    }
  }, [totalDamage]);

  const handleAttack = () => {
    if (currentTurn === "player") {
      const damage = Math.floor(Math.random() * 20) + 10;
      setEnemyHP((prev) => Math.max(0, prev - damage));
      setEnemyDamaged(true);
      createExplosion(500, 140, damage); // Adjust x, y to match enemy position
      setTimeout(() => setEnemyDamaged(false), 300);
      setCurrentTurn("enemy");
    }
  };

  useEffect(() => {
    if (currentTurn === "enemy") {
      const timer = setTimeout(() => {
        const damage = Math.floor(Math.random() * 15) + 5;
        setPlayerHP((prev) => Math.max(0, prev - damage));
        setPlayerDamaged(true);
        createExplosion(180, 240, damage); // Adjust x, y to match player position
        setTimeout(() => setPlayerDamaged(false), 300);
        setCurrentTurn("player");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentTurn]);

  return (
    <div className="relative">
      <div className="absolute top-3 left-0 right-0 flex justify-between p-1 z-10">
        <HPBar hp={playerHP} maxHp={300} label="Player" isPlayer={true} />
        <HPBar hp={enemyHP} maxHp={300} label="Enemy" isPlayer={false} />
      </div>
      <canvas
        ref={canvasRef}
        width={700}
        height={360}
        className="w-full h-auto border-4 border-black rounded-md shadow-inner"
      />
      <button
        onClick={handleAttack}
        disabled={currentTurn !== "player" || playerHP === 0 || enemyHP === 0}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-400"
      >
        Attack
      </button>
    </div>
  );
};

export default CanvasBattleScene;
