import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [counts, setCounts] = useState({ squats: 0, curls: 0 });

  useEffect(() => {
    // 每秒从 Flask 后端获取运动计数
    const interval = setInterval(() => {
      fetch('http://127.0.0.1:5000/get_counts')
        .then(response => response.json())
        .then(data => setCounts(data))
        .catch(error => console.error('Error fetching counts:', error));
    }, 1000);

    return () => clearInterval(interval); // 组件卸载时清除计时器
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Exercise Detector</h1>
        <img src="http://127.0.0.1:5000/video_feed" alt="Video Stream" width="800" />
        <div className="counts">
          <p>Squats: {counts.squats}</p>
          <p>curls: {counts.curls}</p>
          <p>jpunches:  {counts.punches}</p>
          <p>lateral_raises: {counts.lateral_raises}</p>

        </div>
      </header>
    </div>
  );
}

export default App;
