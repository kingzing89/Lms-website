// pages/api/user-subscriptions.js
import mongoose from 'mongoose';
import connectToDatabase from '../../lib/mongodb';
import UserSubscription from '@/models/UserSubscription';
import SubscriptionPlan from '@/models/SubscriptionPlan'; 

const calculateEndDate = (interval, durationMonths = null) => {
  const endDate = new Date();
  
  if (durationMonths) {
    endDate.setMonth(endDate.getMonth() + durationMonths);
  } else {
    switch (interval?.toLowerCase()) {
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      case 'quarterly':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      default:
        endDate.setMonth(endDate.getMonth() + 1); // Default to monthly
    }
  }
  
  return endDate;
};

export default async function handler(req, res) {
  const { method } = req;

  try {
    await connectToDatabase();

    switch (method) {
      case 'GET':
        try {
          const { userId } = req.query;

          if (userId) {
            const subscription = await UserSubscription.getUserSubscription(userId);
            
            if (subscription) {
              await subscription.checkAndUpdateExpiry();
              const updatedSubscription = await UserSubscription.getUserSubscription(userId);
              return res.status(200).json(updatedSubscription);
            }
            
            return res.status(200).json(null);
          } else {
            const subscriptions = await UserSubscription.find({})
              .populate('userId', 'name email')
              .populate('subscriptionPlanId')
              .sort({ createdAt: -1 });
            return res.status(200).json(subscriptions);
          }
        } catch (error) {
          console.error('Error fetching subscriptions:', error);
          res.status(500).json({ error: 'Failed to fetch subscriptions' });
        }
        break;

      case 'POST':
        try {
          const { 
            userId, 
            subscriptionPlanId, 
            paymentMethod, 
            transactionId,
            paymentIntentId, // New Stripe field
            customerId,      // New Stripe field
            status = 'active',
            durationMonths
          } = req.body;

          // For Stripe integration, we need either transactionId OR paymentIntentId
          if (!userId || !subscriptionPlanId || (!transactionId && !paymentIntentId)) {
            return res.status(400).json({ 
              error: 'Missing required fields: userId, subscriptionPlanId, and either transactionId or paymentIntentId' 
            });
          }

          // Get the subscription plan to determine duration
          let plan = null;
          try {
            plan = await SubscriptionPlan.findById(subscriptionPlanId);
          } catch (planError) {
            console.log('Could not fetch plan details, proceeding with duration fallback');
          }

          const existingSubscription = await UserSubscription.findOne({ userId });
          
          const startDate = new Date();
          const endDate = calculateEndDate(plan?.interval, durationMonths);

          const subscriptionData = {
            subscriptionPlanId,
            status,
            startDate,
            endDate,
            paymentMethod: paymentMethod || 'stripe',
            ...(transactionId && { transactionId }),
            ...(paymentIntentId && { paymentIntentId }),
            ...(customerId && { customerId })
          };

          if (existingSubscription) {
            const updatedSubscription = await UserSubscription.findByIdAndUpdate(
              existingSubscription._id,
              subscriptionData,
              { new: true, runValidators: true }
            );

            await updatedSubscription.populate(['userId', 'subscriptionPlanId']);
            return res.status(200).json({
              message: 'Subscription updated successfully',
              subscription: updatedSubscription
            });
          } else {
            const newSubscription = new UserSubscription({
              userId,
              ...subscriptionData
            });

            const savedSubscription = await newSubscription.save();
            await savedSubscription.populate(['userId', 'subscriptionPlanId']);
            
            return res.status(201).json({
              message: 'Subscription created successfully',
              subscription: savedSubscription
            });
          }
        } catch (error) {
          console.error('Error creating/updating subscription:', error);
          if (error.code === 11000) {
            if (error.keyPattern?.transactionId) {
              res.status(400).json({ error: 'Transaction ID already exists' });
            } else if (error.keyPattern?.paymentIntentId) {
              res.status(400).json({ error: 'Payment Intent ID already exists' });
            } else {
              res.status(400).json({ error: 'Duplicate subscription data' });
            }
          } else {
            res.status(500).json({ error: 'Failed to process subscription' });
          }
        }
        break;

      case 'PUT':
        try {
          const { 
            userId, 
            subscriptionPlanId, 
            durationMonths, 
            transactionId,
            paymentIntentId,
            customerId,
            status 
          } = req.body;

          if (!userId || (!transactionId && !paymentIntentId)) {
            return res.status(400).json({ 
              error: 'User ID and either Transaction ID or Payment Intent ID are required' 
            });
          }

          const existingSubscription = await UserSubscription.findOne({ userId });

          if (!existingSubscription) {
            return res.status(404).json({ error: 'User subscription not found' });
          }

          const updateData = {
            ...(status && { status }),
            ...(transactionId && { transactionId }),
            ...(paymentIntentId && { paymentIntentId }),
            ...(customerId && { customerId })
          };

          if (subscriptionPlanId) {
            updateData.subscriptionPlanId = subscriptionPlanId;
          }

          if (durationMonths || subscriptionPlanId) {
            // Get plan details if we're updating the plan
            let plan = null;
            if (subscriptionPlanId) {
              try {
                plan = await SubscriptionPlan.findById(subscriptionPlanId);
              } catch (planError) {
                console.log('Could not fetch plan details for duration calculation');
              }
            }

            const baseDate = existingSubscription.endDate > new Date() 
              ? existingSubscription.endDate 
              : new Date();
            
            const newEndDate = calculateEndDate(plan?.interval, durationMonths);
            updateData.endDate = newEndDate;
          }

          const updatedSubscription = await UserSubscription.findByIdAndUpdate(
            existingSubscription._id,
            updateData,
            { new: true, runValidators: true }
          ).populate(['userId', 'subscriptionPlanId']);

          res.status(200).json({
            message: 'Subscription updated successfully',
            subscription: updatedSubscription
          });
        } catch (error) {
          console.error('Error updating subscription:', error);
          if (error.code === 11000) {
            if (error.keyPattern?.transactionId) {
              res.status(400).json({ error: 'Transaction ID already exists' });
            } else if (error.keyPattern?.paymentIntentId) {
              res.status(400).json({ error: 'Payment Intent ID already exists' });
            } else {
              res.status(400).json({ error: 'Duplicate data' });
            }
          } else {
            res.status(500).json({ error: 'Failed to update subscription' });
          }
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
}