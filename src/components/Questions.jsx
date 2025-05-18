import { useState } from 'react';
import './Questions.css';

function Questions() {
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting question:', { question, email });
    
    try {
      const response = await fetch('https://two-grains-of-salt-git-main-rcwoshimaos-projects.vercel.app/api/submit-question', {
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

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setSubmitted(true);
        setQuestion('');
        setEmail('');
      } else {
        throw new Error(data.error || 'Failed to submit question');
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      alert(error.message || 'Failed to submit question. Please try again later.');
    }
  };

  return (
    <div className="questions-container">
      <h2>Ask Me a Question, and I will try my best to answer according to my constantly-imploving understanding of the world! </h2>
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