import React from "react";

const HealthBar = ({ health, maxHealth }) => {
  const healthPercentage = (health / maxHealth) * 100;

  return (
    <div className="health-bar-container" style={{ width: "200px", height: "25px", border: "2px solid #000", borderRadius: "5px", backgroundColor: "#eee" }}>
      <div
        className="health-bar"
        style={{
          width: `${healthPercentage}%`,
          height: "100%",
          backgroundColor: healthPercentage > 50 ? "green" : healthPercentage > 25 ? "orange" : "red",
          borderRadius: "5px",
          transition: "width 0.3s ease-in-out",
        }}
      ></div>
    </div>
  );
};

export default HealthBar;
