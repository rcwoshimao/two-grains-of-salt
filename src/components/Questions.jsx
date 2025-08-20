import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './Questions.css';

function Questions() {
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('questions')
        .insert([
          {
            content: question,
            email: email || null,
            timestamp: new Date().toISOString(),
            status: 'pending'
          }
        ]);

      if (supabaseError) {
        throw supabaseError;
      }

      setSubmitted(true);
      setQuestion('');
      setEmail('');
    } catch (error) {
      console.error('Error submitting question:', error);
      setError('Failed to submit question. Please try again later.');
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
          <div className="form-group">
            <label htmlFor="email">Your Email (optional):</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="To receive a notification when your question is answered"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit">Submit Question</button>
        </form>
      )}
    </div>
  );
}

export default Questions; 