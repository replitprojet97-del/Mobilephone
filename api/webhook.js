// Vercel Serverless Function for Maxelpay Webhooks
// Handles payment confirmation from Maxelpay

export default async function handler(req, res) {
  // Only allow POST requests for webhooks
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify webhook signature (recommended for production)
    const MAXELPAY_SECRET = process.env.MAXELPAY_SECRET;
    const signature = req.headers['x-maxelpay-signature'];
    
    if (!signature) {
      return res.status(400).json({ error: 'Missing webhook signature' });
    }

    // Get webhook payload
    const { event, data } = req.body;

    // Process different webhook events
    switch (event) {
      case 'payment.succeeded':
        console.log('✅ Payment succeeded:', data.id);
        
        // Here you would typically:
        // 1. Update order status in database
        // 2. Send confirmation email to customer
        // 3. Update inventory
        // 4. Log successful transaction
        
        // For now, we'll just log the success
        await logPaymentSuccess(data);
        break;

      case 'payment.failed':
        console.log('❌ Payment failed:', data.id);
        await logPaymentFailure(data);
        break;

      case 'payment.refunded':
        console.log('💰 Payment refunded:', data.id);
        await logPaymentRefund(data);
        break;

      default:
        console.log('ℹ️ Unhandled webhook event:', event);
    }

    // Always respond with 200 OK to acknowledge receipt
    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ 
      error: 'Webhook processing failed',
      details: error.message 
    });
  }
}

// Helper functions for payment logging
async function logPaymentSuccess(paymentData) {
  // In a real application, you would:
  // - Update order status in database
  // - Send confirmation email
  // - Update product inventory
  
  console.log('Payment Success Details:', {
    paymentId: paymentData.id,
    amount: paymentData.amount,
    currency: paymentData.currency,
    customer: paymentData.customer,
    timestamp: new Date().toISOString()
  });
}

async function logPaymentFailure(paymentData) {
  console.log('Payment Failure Details:', {
    paymentId: paymentData.id,
    reason: paymentData.failure_reason,
    timestamp: new Date().toISOString()
  });
}

async function logPaymentRefund(paymentData) {
  console.log('Payment Refund Details:', {
    paymentId: paymentData.id,
    refundAmount: paymentData.refund_amount,
    timestamp: new Date().toISOString()
  });
}