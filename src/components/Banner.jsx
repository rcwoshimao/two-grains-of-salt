import { useState, useEffect } from 'react';
import './Banner.css';
import rcLogo from '../assets/rc.PNG';

function Banner() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="banner">
      <div className="banner-left">
        <img src={rcLogo} alt="RC" className="banner-logo" />
        <span className="banner-text">rc's site</span>
      </div>
      <button onClick={toggleTheme} className="theme-toggle">
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  );
}

export default Banner; 