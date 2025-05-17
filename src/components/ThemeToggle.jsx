import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import "./ThemeToggle.css";

const sunPath = "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z";
const moonPath = "M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z";

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
          duration: 0.4,
          bounce: 0.3,
        }}
      >
        <motion.svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={false}
          animate={{
            scale: isLight ? 1 : 0.9,
            rotate: isLight ? 0 : 45,
          }}
          transition={{
            duration: 0.4,
          }}
        >
          <motion.path
            d={isLight ? sunPath : moonPath}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{
              pathLength: 1,
              opacity: 1,
            }}
            transition={{
              duration: 0.4,
            }}
          />
        </motion.svg>
      </motion.div>
    </button>
  );
}

export default ThemeToggle; 