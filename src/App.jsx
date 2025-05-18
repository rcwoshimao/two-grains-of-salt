import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import BlogPost from './components/BlogPost';
import Questions from './components/Questions';
import './App.css';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:slug" element={<BlogPost />} />
        <Route path="/questions" element={<Questions />} />
      </Routes>
    </div>
  );
}

export default App;
