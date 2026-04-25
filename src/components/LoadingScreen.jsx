import justdoit from '../assets/justdoit.png';
import './LoadingScreen.css';

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <img src={justdoit} alt="Two grains of salt icon" className="loading-icon" />
      <h1 className="loading-title">Two grains of salt</h1>
      <p className="loading-welcome">welcome</p>
    </div>
  );
}

export default LoadingScreen;
