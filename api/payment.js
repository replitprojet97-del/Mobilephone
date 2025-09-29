// Vercel Serverless Function for Maxelpay Integration
// This replaces the complex server-side payment processing

export default async function handler(req, res) {
  // Enable CORS for frontend requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests for payment processing
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, currency = 'EUR', description, customerEmail } = req.body;

    // Validate required fields
    if (!amount || !customerEmail) {
      return res.status(400).json({ 
        error: 'Missing required fields: amount and customerEmail' 
      });
    }

    // Maxelpay API configuration (from environment variables)
    const MAXELPAY_API_KEY = process.env.MAXELPAY_KEY;
    const MAXELPAY_SECRET = process.env.MAXELPAY_SECRET;
    const MAXELPAY_ENDPOINT = 'https://api.maxelpay.com/v1/payments';

    if (!MAXELPAY_API_KEY || !MAXELPAY_SECRET) {
      return res.status(500).json({ 
        error: 'Payment gateway configuration missing' 
      });
    }

    // Prepare payment data for Maxelpay
    const paymentData = {
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toUpperCase(),
      description: description || 'LUXIO Purchase',
      customer: {
        email: customerEmail
      },
      success_url: `${req.headers.origin || 'https://luxio.vercel.app'}/success`,
      cancel_url: `${req.headers.origin || 'https://luxio.vercel.app'}/cancel`,
      webhook_url: `${req.headers.origin || 'https://luxio.vercel.app'}/api/webhook`
    };

    // Create payment with Maxelpay
    const response = await fetch(MAXELPAY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MAXELPAY_API_KEY}`,
        'X-API-Secret': MAXELPAY_SECRET
      },
      body: JSON.stringify(paymentData)
    });

    const paymentResult = await response.json();

    if (!response.ok) {
      console.error('Maxelpay API Error:', paymentResult);
      return res.status(400).json({
        error: 'Payment creation failed',
        details: paymentResult.message || 'Unknown error'
      });
    }

    // Return payment session to frontend
    return res.status(200).json({
      success: true,
      paymentId: paymentResult.id,
      paymentUrl: paymentResult.checkout_url,
      sessionId: paymentResult.session_id
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}