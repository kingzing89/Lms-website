// pages/api/subscriptions.js
import SubscriptionPlan from '../../models/SubscriptionPlan';
import connectToDatabase from '../../lib/mongodb';

export default async function handler(req, res) {

  await connectToDatabase();

  try {
    const plans = await SubscriptionPlan.find({});
    res.status(200).json(plans);
  } catch (error) {
    console.error('Failed to fetch subscription plans:', error);
    res.status(500).json({ error: 'Failed to fetch subscription plans' });
  }
}