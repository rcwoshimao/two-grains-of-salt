import { useEffect, useState } from 'react';
import './ReadingProgress.css';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop || 0;
      const scrollHeight = doc.scrollHeight || document.body.scrollHeight || 0;
      const clientHeight = doc.clientHeight || window.innerHeight || 0;
      const max = Math.max(1, scrollHeight - clientHeight);
      setProgress(Math.min(1, Math.max(0, scrollTop / max)));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className="reading-progress" aria-hidden="true">
      <div
        className="reading-progress__bar"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

