import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './Home';
import BlogPost from './components/BlogPost';
import './App.css';

function App() {
  return (
    <BrowserRouter basename="/three-grains-of-salt">
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:slug" element={<BlogPost />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
