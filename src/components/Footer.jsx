import { FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="social-links">
          <a href="https://github.com/rcwoshimao" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub />
          </a>
          <a href="https://linkedin.com/in/jiaying-chen01" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedin />
          </a>
          <a href="https://rc-personal-website.vercel.app/" target="_blank" rel="noopener noreferrer" aria-label="Personal Website">
            <FaGlobe />
          </a>
        </div>
        <div className="footer-text">
          <p>© {currentYear} rcwoshimao, All rights reserved.</p>
          <p className="footer-quote">"Two grains of salt" — A collection of thoughts on technology, life, and everything in between.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 