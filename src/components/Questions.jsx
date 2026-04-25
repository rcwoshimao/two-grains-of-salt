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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const widgetContainerRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    const removeWidget = () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* widget already gone */
        }
        widgetIdRef.current = null;
      }
      setTurnstileToken('');
    };

    if (!turnstileSiteKey) {
      return;
    }

    // Form (and Turnstile mount node) are not in the DOM while thank-you or sending.
    if (submitted || isSubmitting) {
      removeWidget();
      return;
    }

    let cancelled = false;
    let onScriptLoad = null;
    let scriptElForCleanup = null;

    const renderWidget = () => {
      if (cancelled || !widgetContainerRef.current || !window.turnstile) {
        return;
      }

      if (widgetIdRef.current !== null) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* ignore */
        }
        widgetIdRef.current = null;
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

    const scheduleRender = () => {
      requestAnimationFrame(() => {
        if (cancelled) return;
        renderWidget();
      });
    };

    if (window.turnstile) {
      scheduleRender();
    } else {
      const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID);
      if (existingScript) {
        scriptElForCleanup = existingScript;
        onScriptLoad = () => {
          if (!cancelled) scheduleRender();
        };
        existingScript.addEventListener('load', onScriptLoad, { once: true });
        // If the script already finished loading, `load` will not fire again.
        if (existingScript.readyState === 'complete' || existingScript.readyState === 'loaded') {
          scheduleRender();
        }
      } else {
        const script = document.createElement('script');
        script.id = TURNSTILE_SCRIPT_ID;
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        scriptElForCleanup = script;
        onScriptLoad = () => {
          if (!cancelled) scheduleRender();
        };
        script.addEventListener('load', onScriptLoad, { once: true });
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      if (onScriptLoad && scriptElForCleanup) {
        scriptElForCleanup.removeEventListener('load', onScriptLoad);
      }
      removeWidget();
    };
  }, [turnstileSiteKey, submitted, isSubmitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!turnstileSiteKey) {
      setError('Turnstile is not configured. Please contact site owner.');
      setIsSubmitting(false);
      return;
    }

    if (!turnstileToken) {
      setError('Please complete the verification step.');
      setIsSubmitting(false);
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

      if (widgetIdRef.current !== null && window.turnstile) {
        try {
          window.turnstile.reset(widgetIdRef.current);
        } catch (resetError) {
          console.warn('Turnstile reset skipped:', resetError);
        }
      }
      setSubmitted(true);
      setQuestion('');
      setTurnstileToken('');
    } catch (error) {
      console.error('Error submitting question:', error);
      setError(error.message || 'Failed to submit question. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="questions-container">
      <Link to="/" className="back-link">← Back</Link>
      <h2> Ask me any questions or tell me about your day. </h2>
      {submitted ? (
        <div className="success-message">
          <p>Thank you for your question!</p>
          <button onClick={() => setSubmitted(false)}>Ask Another Question</button>
        </div>
      ) : isSubmitting ? (
        <div className="success-message">
          <p>Sending question...</p>
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