import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './Home';
import BlogPost from './components/BlogPost';
import Questions from './components/QnA/Questions';
import LoadingScreen from './components/LoadingScreen';
import Footer from './components/Footer';

function App() {
  const LOADING_MS = 1200;
  const SLIDE_OUT_MS = 800;

  const LOADING_SEEN_KEY = 'two-grains-of-salt:loading-seen';

  const [showLoading, setShowLoading] = useState(() => {
    try {
      return window.sessionStorage.getItem(LOADING_SEEN_KEY) !== '1';
    } catch {
      return true;
    }
  });
  const [exitingLoading, setExitingLoading] = useState(false);

  useEffect(() => {
    if (!showLoading) return;

    try {
      window.sessionStorage.setItem(LOADING_SEEN_KEY, '1');
    } catch {
      // If storage is blocked, just behave like "always show".
    }

    const startExit = window.setTimeout(() => setExitingLoading(true), LOADING_MS);
    const remove = window.setTimeout(
      () => setShowLoading(false),
      LOADING_MS + SLIDE_OUT_MS
    );

    return () => {
      window.clearTimeout(startExit);
      window.clearTimeout(remove);
    };
  }, [showLoading]);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loading" element={<LoadingScreen exitMs={SLIDE_OUT_MS} />} />
        <Route path="/post/:slug" element={<BlogPost />} />
        <Route path="/questions" element={<Questions />} />
      </Routes>
      <Footer />

      {showLoading && <LoadingScreen exiting={exitingLoading} exitMs={SLIDE_OUT_MS} />}
    </div>
  );
}

export default App;
