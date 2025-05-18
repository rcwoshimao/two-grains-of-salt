import { useState } from 'react';
import './Questions.css';

function Questions() {
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/.netlify/functions/submit-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          email,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setQuestion('');
        setEmail('');
      } else {
        throw new Error('Failed to submit question');
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      alert('Failed to submit question. Please try again later.');
    }
  };

  return (
    <div className="questions-container">
      <h2>Ask a Question</h2>
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
          <button type="submit">Submit Question</button>
        </form>
      )}
    </div>
  );
}

export default Questions; 