import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Questions.css';

const TURNSTILE_SCRIPT_ID = 'cf-turnstile-script';

function Questions() {
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const widgetContainerRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    if (!turnstileSiteKey || !widgetContainerRef.current) {
      return;
    }

    const renderWidget = () => {
      if (!widgetContainerRef.current || !window.turnstile) {
        return;
      }

      if (widgetIdRef.current !== null) {
        window.turnstile.remove(widgetIdRef.current);
      }

      widgetIdRef.current = window.turnstile.render(widgetContainerRef.current, {
        sitekey: turnstileSiteKey,
        theme: 'auto',
        callback: (token) => {
          setTurnstileToken(token);
          setError('');
        },
        'expired-callback': () => {
          setTurnstileToken('');
        },
        'error-callback': () => {
          setTurnstileToken('');
          setError('Verification failed. Please try again.');
        }
      });
    };

    if (window.turnstile) {
      renderWidget();
      return;
    }

    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener('load', renderWidget, { once: true });
      return () => {
        existingScript.removeEventListener('load', renderWidget);
      };
    }

    const script = document.createElement('script');
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.addEventListener('load', renderWidget, { once: true });
    document.head.appendChild(script);

    return () => {
      script.removeEventListener('load', renderWidget);
    };
  }, [turnstileSiteKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!turnstileSiteKey) {
      setError('Turnstile is not configured. Please contact site owner.');
      return;
    }

    if (!turnstileToken) {
      setError('Please complete the verification step.');
      return;
    }

    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question,
          turnstileToken
        })
      });

      if (!response.ok) {
        const responseBody = await response.json().catch(() => ({}));
        throw new Error(responseBody.error || 'Failed to send question');
      }

      setSubmitted(true);
      setQuestion('');
      setTurnstileToken('');
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      setError(error.message || 'Failed to submit question. Please try again later.');
    }
  };

  return (
    <div className="questions-container">
      <Link to="/" className="back-link">← Back</Link>
      <h2> Ask me any questions, or give me any suggestions lowkey </h2>
      {submitted ? (
        <div className="success-message">
          <p>Thank you for your question! I'll review it and may feature it in a future post.</p>
          <button onClick={() => setSubmitted(false)}>Ask Another Question</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="question-form">
          <div className="form-group">
            <label htmlFor="question">Your Question:</label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              maxLength={1000}
              placeholder="What's on your mind?"
            />
          </div>
          <div className="turnstile-container" ref={widgetContainerRef} />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={!turnstileToken}>
            Submit Question
          </button>
        </form>
      )}
    </div>
  );
}

export default Questions; 