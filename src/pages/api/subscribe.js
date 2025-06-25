import connectToDatabase from '../../lib/mongodb';
import SubscriptionPlan from '../../models/SubscriptionPlan';
import UserSubscription from '../../models/UserSubscription';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

 connectToDatabase();

  const { userId, subscriptionPlanId, paymentMethod, transactionId } = req.body;

  if (!userId || !subscriptionPlanId || !paymentMethod || !transactionId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const plan = await SubscriptionPlan.findById(subscriptionPlanId);
    if (!plan) return res.status(404).json({ error: 'Subscription plan not found' });

 
    const startDate = new Date();
    const endDate = new Date(startDate);
    if (plan.interval === 'weekly') {
      endDate.setDate(endDate.getDate() + 7);
    } else if (plan.interval === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan.interval === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const existingSub = await UserSubscription.findOne({ userId });

    if (existingSub) {
      existingSub.subscriptionPlanId = subscriptionPlanId;
      existingSub.startDate = startDate;
      existingSub.endDate = endDate;
      existingSub.paymentMethod = paymentMethod;
      existingSub.transactionId = transactionId;
      existingSub.status = 'active';
      await existingSub.save();
    } else {
      await UserSubscription.create({
        userId,
        subscriptionPlanId,
        paymentMethod,
        transactionId,
        startDate,
        endDate,
        status: 'active'
      });
    }

    return res.status(200).json({ message: 'Subscription successful' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
