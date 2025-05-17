import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import "./ThemeToggle.css";

function ThemeToggle() {
  const [isLight, setIsLight] = useState(() => {
    // Initialize from localStorage, default to dark theme
    const saved = localStorage.getItem("theme");
    return saved === "light";
  });

  useEffect(() => {
    // Update the data-theme attribute on root element
    const theme = isLight ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isLight]);

  const toggleTheme = () => {
    setIsLight(!isLight);
  };

  return (
    <button
      className={`toggle-container ${isLight ? "light" : "dark"}`}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <motion.div
        className="toggle-handle"
        layout
        transition={{
          type: "spring",
          duration: 0.2,
          bounce: 0.2,
        }}
      >
        <span className="toggle-icon">
          {/*isLight ? "☀️" : "🌙"*/}
        </span>
      </motion.div>
    </button>
  );
}

export default ThemeToggle; 