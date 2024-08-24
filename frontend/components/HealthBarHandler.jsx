import React, { useState } from "react";
import HealthBar from "./HealthBar"; // Make sure the path is correct based on your file structure

const HealthBarHandler = () => {
  const [health, setHealth] = useState(100);
  const maxHealth = 100;

  const decreaseHealth = () => {
    setHealth((prevHealth) => Math.max(prevHealth - 10, 0));
  };

  const increaseHealth = () => {
    setHealth((prevHealth) => Math.min(prevHealth + 10, maxHealth));
  };

  return (
    <div className="app-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      <h1>Health Bar Example</h1>
      <HealthBar health={health} maxHealth={maxHealth} />
      <div>
        <button onClick={decreaseHealth} style={{ marginRight: "10px", padding: "10px", fontSize: "16px" }}>Decrease Health</button>
        <button onClick={increaseHealth} style={{ padding: "10px", fontSize: "16px" }}>Increase Health</button>
      </div>
    </div>
  );
};

export default HealthBarHandler;
