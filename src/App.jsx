import './App.css';
import { Routes, Route } from 'react-router-dom'; 
import Home from './Home.jsx';


const App = () => {
  return(
      <div className='something'>
        <div> Miao miao </div>
        <div>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        </div>
      </div>
  ); 
}

export default App;
