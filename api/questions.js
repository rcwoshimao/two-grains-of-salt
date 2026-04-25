import nodemailer from 'nodemailer';

const REQUIRED_ENV_VARS = [
  'GMAIL_USER',
  'GMAIL_APP_PASSWORD',
  'QUESTION_NOTIFICATION_TO',
  'TURNSTILE_SECRET_KEY'
];

function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getClientIp(req) {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (typeof xForwardedFor === 'string' && xForwardedFor.length > 0) {
    return xForwardedFor.split(',')[0].trim();
  }
  return undefined;
}

async function verifyTurnstileToken(token, remoteIp) {
  const body = new URLSearchParams();
  body.append('secret', process.env.TURNSTILE_SECRET_KEY);
  body.append('response', token);
  if (remoteIp) {
    body.append('remoteip', remoteIp);
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });

  if (!response.ok) {
    throw new Error('Turnstile verification request failed');
  }

  return response.json();
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      service: 'questions-email-api',
      message: 'API is reachable. Use POST to submit a question.',
      expectedBody: {
        question: 'string (required, max 1000 chars)',
        turnstileToken: 'string (required)'
      }
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowedMethods: ['GET', 'POST']
    });
  }

  try {
    validateEnv();

    const { question, turnstileToken } = req.body ?? {};
    const cleanedQuestion = typeof question === 'string' ? question.trim() : '';
    const cleanedToken = typeof turnstileToken === 'string' ? turnstileToken.trim() : '';

    if (!cleanedQuestion) {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (cleanedQuestion.length > 1000) {
      return res.status(400).json({ error: 'Question is too long' });
    }

    if (!cleanedToken) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    const verification = await verifyTurnstileToken(cleanedToken, getClientIp(req));
    if (!verification.success) {
      return res.status(400).json({ error: 'Turnstile verification failed' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const submittedAt = new Date().toISOString();
    const subject = 'New Question from Two Grains of Salt';

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.QUESTION_NOTIFICATION_TO,
      subject,
      text: [
        'You received a new website question.',
        '',
        `Submitted at: ${submittedAt}`,
        'Question:',
        cleanedQuestion
      ].join('\n'),
      html: `
        <p>You received a new website question.</p>
        <p><strong>Submitted at:</strong> ${escapeHtml(submittedAt)}</p>
        <p><strong>Question:</strong></p>
        <p>${escapeHtml(cleanedQuestion).replaceAll('\n', '<br />')}</p>
      `
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Failed to send question email:', error);
    return res.status(500).json({ error: 'Failed to send question' });
  }
}
