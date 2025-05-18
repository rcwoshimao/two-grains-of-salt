import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Banner.css';
import rcLogo from '../assets/rc.PNG';
import ThemeToggle from './ThemeToggle';

function Banner() {
  return (
    <div className="banner">
      <div className="banner-left">
        <img src={rcLogo} alt="RC" className="banner-logo" />
        <span className="banner-text">Two grains of salt</span>
      </div>
      <div className="banner-right">
        <Link to="/questions" className="questions-link">Questions?</Link>
        <ThemeToggle />
      </div>
    </div>
  );
}

export default Banner; 