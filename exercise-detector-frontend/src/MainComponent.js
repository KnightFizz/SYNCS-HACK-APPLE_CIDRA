// MainComponent.js
import React from 'react';

function MainComponent({ registeredUser }) {
  return (
    <div>
      <h2>Welcome, {registeredUser}!</h2>
      <p>This is the main exercise detector page.</p>
      {/* Add any additional content or components here */}
    </div>
  );
}

export default MainComponent;
