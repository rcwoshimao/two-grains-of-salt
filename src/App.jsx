import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './Home';
import BlogPost from './components/BlogPost';
import Questions from './components/Questions';
import Footer from './components/Footer';
import './App.css';

function App() {
  // Initialize theme on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:slug" element={<BlogPost />} />
        <Route path="/questions" element={<Questions />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
