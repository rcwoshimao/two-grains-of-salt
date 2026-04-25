import rc from '../assets/rc.PNG';
import './LoadingScreen.css';

function LoadingScreen({ exiting = false } = {}) {
  return (
    <div className={`loading-screen${exiting ? ' loading-screen--exiting' : ''}`}>
      <img src={rc} alt="Two grains of salt icon" className="loading-icon" />
      <h1 className="loading-title">Two grains of salt</h1>
      <p className="loading-welcome">welcome</p>
    </div>
  );
}

export default LoadingScreen;
