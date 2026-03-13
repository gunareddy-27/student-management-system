import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import "./DarkModeToggle.css"; // Ensure this is correct

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button className="dark-mode-toggle" onClick={toggleTheme}>
      {theme === 'dark' ? "Light Mode 🌞" : "Dark Mode 🌙"}
    </button>
  );
};

export default DarkModeToggle;
