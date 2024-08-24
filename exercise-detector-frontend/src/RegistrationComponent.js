// RegistrationComponent.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

function RegistrationComponent({ onRegister }) {
  const [username, setUsername] = useState('');
  const navigate = useNavigate(); // Get the navigate function

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username) {
      onRegister(username); // Pass the username to parent
      navigate('/main'); // Redirect to the main page
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegistrationComponent;
