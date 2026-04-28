import rc from '../assets/rc.PNG';
import './LoadingScreen.css';

function LoadingScreen({ exiting = false, exitMs } = {}) {
  return (
    <div
      className={`loading-screen${exiting ? ' loading-screen--exiting' : ''}`}
      style={exitMs != null ? { '--loading-exit-ms': `${exitMs}ms` } : undefined}
    >
      <img src={rc} alt="Two grains of salt icon" className="loading-icon" />
      <h1 className="loading-title">Two grains of salt</h1>
      <p className="loading-welcome">welcome</p>
    </div>
  );
}

export default LoadingScreen;
