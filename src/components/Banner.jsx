import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Banner.css';
import rcLogo from '../assets/rc.PNG';
import ThemeToggle from './ThemeToggle';

function Banner() {
  const bannerRef = useRef(null);

  useLayoutEffect(() => {
    const el = bannerRef.current;
    if (!el) return;

    const setBannerHeightVar = () => {
      const height = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--banner-height', `${height}px`);
    };

    setBannerHeightVar();

    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(setBannerHeightVar);  
      ro.observe(el);
    }

    window.addEventListener('resize', setBannerHeightVar);
    return () => {
      window.removeEventListener('resize', setBannerHeightVar);
      ro?.disconnect();
    };
  }, []);

  return (
    <div className="banner" ref={bannerRef}>
      <div className="banner-left">
        <a
          className="banner-logo-link"
          href="https://rcwoshimaodev.vercel.app/"
          aria-label="Go to RC's personal website"
        >
          <img src={rcLogo} alt="RC" className="banner-logo" />
        </a>
        <Link to="/" className="banner-text" style={{ textDecoration: 'none' }} >Two grains of salt</Link>
        {/*<span className="banner-text">Two grains of salt</span>*/}
      </div>
      <div className="banner-right">
        <Link to="/questions" className="questions-link">Ask me anything</Link>
        <ThemeToggle />
      </div>
    </div>
  );
}

export default Banner; 