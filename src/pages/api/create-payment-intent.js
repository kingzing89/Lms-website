import Stripe from 'stripe';
import SubscriptionPlan from '@/models/SubscriptionPlan';
import connectToDatabase from '@/lib/mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await connectToDatabase();

  try {
    const { amount, planId, userId } = req.body;

    if (!amount || !planId || !userId) {
      return res.status(400).json({ 
        error: 'Missing required fields: amount, planId, userId' 
      });
    }

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ error: 'Subscription plan not found' });
    }

    const amountInCents = Math.round(amount * 100);
    if (amountInCents !== Math.round(plan.price * 100)) {
      return res.status(400).json({ 
        error: 'Amount does not match plan price' 
      });
    }

    let customer;
    try {
      customer = await stripe.customers.create({
        email: req.body.email, 
        metadata: { userId }
      });
    } catch (err) {
      console.error('Customer creation error:', err);
      return res.status(500).json({ 
        error: 'Failed to create customer record' 
      });
    }


      const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency: 'usd',
          customer: customer.id,
          metadata: { planId, userId },
          payment_method_types: ['card'], 
          description: `Subscription: ${plan.title}`
      }, {
          idempotencyKey: `pi_${userId}_${Date.now()}`
      });

   

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      customerId: customer.id
    });

  } catch (error) {
    console.error('Stripe API error:', {
      message: error.message,
      code: error.code,
      type: error.type
    });

    res.status(500).json({
      error: 'Payment processing failed',
      details: error.raw?.message || error.message
    });
  }
}