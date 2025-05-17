import { useState, useEffect } from 'react';
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
      <ThemeToggle />
    </div>
  );
}

export default Banner; 