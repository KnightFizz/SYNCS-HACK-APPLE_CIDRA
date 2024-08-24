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

const Modal = ({ isOpen, onClose, result }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold mb-4">
          {result === "win" ? "You Win!" : "You Lose!"}
        </h2>
        <p className="text-xl mb-6">
          {result === "win"
            ? "Congratulations on your victory!"
            : "Better luck next time!"}
        </p>
      </div>
    </div>
  );
};

const CanvasBattleScene = ({ damageReceived, totalDamage }) => {

  console.log("damageReceived at Canvas:", damageReceived);

  const damage = damageReceived.dmg;
  console.log("damageReceived at Canvas:", damage);
  console.log("typeof dmg:", typeof damage);


  const canvasRef = useRef(null);
  const [playerHP, setPlayerHP] = useState(500);
  const [enemyHP, setEnemyHP] = useState(500);
  // const [currentTurn, setCurrentTurn] = useState("player");
  const [playerDamaged, setPlayerDamaged] = useState(false);
  const [enemyDamaged, setEnemyDamaged] = useState(false);
  const [particles, setParticles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameResult, setGameResult] = useState(null);

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
        ctx.save();
        ctx.scale(-1, 1);
        if (playerDamaged) {
          ctx.filter = "saturate(200%) hue-rotate(300deg)";
          ctx.translate(Math.random() * 4 - 2, Math.random() * 4 - 2);
        }
        ctx.drawImage(playerImage, -270, canvas.height - 200, 150, 150);
        ctx.restore();

        // Draw enemy with damage effect
        ctx.save();
        if (enemyDamaged) {
          ctx.filter = "saturate(1000%) hue-rotate(300deg)";
          ctx.translate(Math.random() * 4 - 2, Math.random() * 4 - 2);
        }
        ctx.drawImage(
          enemyImage,
          canvas.width - 300,
          canvas.height - 300,
          150,
          150
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
  }, [playerDamaged, enemyDamaged, particles]);

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

  // Update player's HP if damageReceived is not zero
  useEffect(() => {
    // console.log(damageReceived);
    if (damage > 0) {
      const newPlayerHP = Math.max(0, playerHP - damage);
      setPlayerHP(newPlayerHP);
      setPlayerDamaged(true);
      createExplosion(180, 240, damage);
      setTimeout(() => setPlayerDamaged(false), 300);

      if (newPlayerHP === 0) {
        setGameResult("lose");
        setIsModalOpen(true);
      }
    }
  }, [damage]);

  useEffect(() => {
    if (totalDamage > 0) {
      const newEnemyHP = Math.max(0, enemyHP - totalDamage);
      setEnemyHP(newEnemyHP);
      setEnemyDamaged(true);
      createExplosion(470, 140, totalDamage);
      setTimeout(() => setEnemyDamaged(false), 300);

      if (newEnemyHP === 0) {
        setGameResult("win");
        setIsModalOpen(true);
      }
    }
  }, [totalDamage]);

  // const handleAttack = () => {
  //   if (currentTurn === "player") {
  //     const damage = Math.floor(Math.random() * 20) + 10;
  //     const newEnemyHP = Math.max(0, enemyHP - damage);
  //     setEnemyHP(newEnemyHP);
  //     setEnemyDamaged(true);
  //     createExplosion(500, 140, damage);
  //     setTimeout(() => setEnemyDamaged(false), 300);
  //     setCurrentTurn("enemy");

  //     if (newEnemyHP === 0) {
  //       setGameResult("win");
  //       setIsModalOpen(true);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (currentTurn === "enemy") {
  //     const timer = setTimeout(() => {
  //       const damage = Math.floor(Math.random() * 15) + 5;
  //       const newPlayerHP = Math.max(0, playerHP - damage);
  //       setPlayerHP(newPlayerHP);
  //       setPlayerDamaged(true);
  //       createExplosion(180, 240, damage);
  //       setTimeout(() => setPlayerDamaged(false), 300);
  //       setCurrentTurn("player");

  //       if (newPlayerHP === 0) {
  //         setGameResult("lose");
  //         setIsModalOpen(true);
  //       }
  //     }, 1000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [currentTurn]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Reset the game state
    setPlayerHP(500);
    setEnemyHP(500);
    setParticles([]);
    setGameResult(null);
  };

  return (
    <div className="relative">
      <div className="absolute top-3 left-0 right-0 flex justify-between p-1 z-10">
        <HPBar hp={playerHP} maxHp={500} label="You" isPlayer={true} />
        <HPBar hp={enemyHP} maxHp={500} label="Enemy" isPlayer={false} />
      </div>
      <canvas
        ref={canvasRef}
        width={700}
        height={360}
        className="w-full h-auto border-4 border-black rounded-md shadow-inner"
      />
      {/* <button
        onClick={handleAttack}
        disabled={currentTurn !== "player" || playerHP === 0 || enemyHP === 0}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-400"
      >
        Attack
      </button> */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        result={gameResult}
      />
    </div>
  );
};

export default CanvasBattleScene;
