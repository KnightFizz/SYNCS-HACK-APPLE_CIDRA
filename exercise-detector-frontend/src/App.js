import React, { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://127.0.0.1:5000');

function App() {
  const [counts, setCounts] = useState({ squats: 0, curls: 0 });
  const [username, setUsername] = useState('');
  const [registeredUser, setRegisteredUser] = useState('');
  const [competitionUsers, setCompetitionUsers] = useState([]);

  // Function to handle user registration
  const handleRegister = () => {
    if (username) {
      fetch('http://127.0.0.1:5000/register_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
      })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            setRegisteredUser(username);
            setUsername('');
            console.log(`User ${username} registered successfully.`);
            socket.emit('join_competition', { username });
          } else {
            console.error('Error registering user:', data.error);
          }
        })
        .catch(error => console.error('Error registering user:', error));
    } else {
      alert('Please enter a username.');
    }
  };

  // Function to fetch user's exercise counts
  const fetchCounts = (username) => {
    fetch(`http://127.0.0.1:5000/get_counts/${username}`)
      .then(response => response.json())
      .then(data => {
        if (data.username) {
          setCounts({ squats: data.counts.squats, curls: data.counts.curls });
        } else {
          console.error('Error fetching counts:', data.error);
        }
      })
      .catch(error => console.error('Error fetching counts:', error));
  };

  useEffect(() => {
    const handleUserJoined = (data) => {
      console.log(`User joined: ${data.username}`);
      setCompetitionUsers((prevUsers) => [...prevUsers, data]);
    };

    const handleScoreUpdate = (data) => {
      console.log(`Score update: ${data.username} - ${data.score}`);
      setCompetitionUsers((prevUsers) =>
        prevUsers.map(user =>
          user.username === data.username ? { ...user, score: data.score } : user
        )
      );
    };

    socket.on('user_joined', handleUserJoined);
    socket.on('score_update', handleScoreUpdate);

    return () => {
      socket.off('user_joined', handleUserJoined);
      socket.off('score_update', handleScoreUpdate);
    };
  }, []);

  // Periodically fetch counts for the registered user
  useEffect(() => {
    if (registeredUser) {
      const interval = setInterval(() => fetchCounts(registeredUser), 5000); // Fetch counts every 5 seconds
      return () => clearInterval(interval);
    }
  }, [registeredUser]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Exercise Detector</h1>
        {!registeredUser ? (
          <div className="registration">
            <h2>Register User</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
            <button onClick={handleRegister}>Register</button>
          </div>
        ) : (
          <div>
            <h2>Welcome, {registeredUser}!</h2>
            <img
              src={`http://127.0.0.1:5000/video_feed/${registeredUser}`}
              alt="Video Stream"
              width="800"
            />
            <div className="counts">
              <p>Squats: {counts.squats}</p>
              <p>Curls: {counts.curls}</p>
            </div>
            <h3>Competition Leaderboard</h3>
            <table className="leaderboard">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {competitionUsers.map((user, index) => (
                  <tr key={index}>
                    <td>{user.username}</td>
                    <td>{user.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
