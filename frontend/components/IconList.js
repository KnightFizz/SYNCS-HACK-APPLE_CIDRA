import React, { useState } from 'react';
import styles from '../styles/IconList.module.css'; // Import the CSS module

const IconList = () => {
  const [icons, setIcons] = useState([
    { id: 1, name: '🔥' },
    { id: 2, name: '🧊' },
    { id: 3, name: '🌪️' },
    { id: 4, name: '🔒' },
  ]);

  const [newIcon, setNewIcon] = useState('');

  const handleRemoveIcon = (id) => {
    setIcons(icons.filter((icon) => icon.id !== id));
  };

  const handleAddIcon = (e) => {
    // Prevent adding an icon if clicking on an existing icon
    if (e.target.className.includes(styles.icon)) {
      return;
    }
    const newIcon = '⭐'; // Default new icon to add (you can make this dynamic)
    setIcons([...icons, { id: icons.length + 1, name: newIcon }]);
  };

  return (
    <div className={styles.iconListContainer} onClick={handleAddIcon}>
      {icons.map((icon) => (
        <div
          key={icon.id}
          className={styles.iconBox}
          onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling to avoid triggering add icon
            handleRemoveIcon(icon.id);
          }}
        >
          <span className={styles.icon}>{icon.name}</span>
        </div>
      ))}
    </div>
  );
};

export default IconList;
