const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !email || emailRegex.test(email);
};

// Content validation
const sanitizeContent = (content) => {
  // Remove any HTML tags
  return content
    .replace(/<[^>]*>/g, '')
    // Limit length
    .slice(0, 1000)
    // Basic XSS prevention
    .replace(/[<>]/g, '');
};

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { question, email, timestamp } = JSON.parse(event.body);

    // Validate inputs
    if (!question || question.trim().length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Question is required' })
      };
    }

    if (!isValidEmail(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    // Sanitize the question content
    const sanitizedQuestion = sanitizeContent(question);

    // Store in Supabase
    const { data, error } = await supabase
      .from('questions')
      .insert([
        {
          content: sanitizedQuestion,
          email: email || null,
          timestamp,
          status: 'pending' // pending, approved, rejected
        }
      ]);

    if (error) throw error;

    // If you want email notifications, you can add SendGrid or similar here
    if (process.env.ADMIN_EMAIL) {
      // Send notification email to admin (implementation depends on your email service)
      // await sendAdminNotification(process.env.ADMIN_EMAIL, sanitizedQuestion);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Question submitted successfully' })
    };
  } catch (error) {
    console.error('Error processing question:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}; 