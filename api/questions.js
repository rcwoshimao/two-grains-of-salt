import nodemailer from 'nodemailer';

const REQUIRED_ENV_VARS = [
  'GMAIL_USER',
  'GMAIL_APP_PASSWORD',
  'QUESTION_NOTIFICATION_TO'
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

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      service: 'questions-email-api',
      message: 'API is reachable. Use POST to submit a question.',
      expectedBody: {
        question: 'string (required, max 1000 chars)',
        email: 'string (optional)'
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

    const { question, email } = req.body ?? {};
    const cleanedQuestion = typeof question === 'string' ? question.trim() : '';
    const cleanedEmail = typeof email === 'string' ? email.trim() : '';

    if (!cleanedQuestion) {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (cleanedQuestion.length > 1000) {
      return res.status(400).json({ error: 'Question is too long' });
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
      replyTo: cleanedEmail || undefined,
      subject,
      text: [
        'You received a new website question.',
        '',
        `Submitted at: ${submittedAt}`,
        `From email: ${cleanedEmail || 'Not provided'}`,
        '',
        'Question:',
        cleanedQuestion
      ].join('\n'),
      html: `
        <p>You received a new website question.</p>
        <p><strong>Submitted at:</strong> ${escapeHtml(submittedAt)}</p>
        <p><strong>From email:</strong> ${escapeHtml(cleanedEmail || 'Not provided')}</p>
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
