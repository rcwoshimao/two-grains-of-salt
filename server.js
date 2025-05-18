import express from 'express';
import cors from 'cors';
import handler from './api/_handler.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/_handler', async (req, res) => {
  try {
    // Convert Express request to Fetch API Request for compatibility
    const request = new Request('http://localhost:3000/api/_handler', {
      method: req.method,
      headers: req.headers,
      body: JSON.stringify(req.body),
    });

    const response = await handler(request);
    const data = await response.json();
    
    res.status(response.status);
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }
    res.json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
}); 