// pages/api/user-subscriptions.js
import mongoose from 'mongoose';
import connectToDatabase from '../../lib/mongodb';
import UserSubscription from '@/models/UserSubscription';




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
            durationMonths = 1 
          } = req.body;

          if (!userId || !subscriptionPlanId || !paymentMethod || !transactionId) {
            return res.status(400).json({ 
              error: 'Missing required fields: userId, subscriptionPlanId, paymentMethod, transactionId' 
            });
          }

          const existingSubscription = await UserSubscription.findOne({ userId });
          
          if (existingSubscription) {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + durationMonths);

            const updatedSubscription = await UserSubscription.findByIdAndUpdate(
              existingSubscription._id,
              {
                subscriptionPlanId,
                status: 'active',
                startDate,
                endDate,
                paymentMethod,
                transactionId
              },
              { new: true, runValidators: true }
            );

            await updatedSubscription.populate(['userId', 'subscriptionPlanId']);
            return res.status(200).json({
              message: 'Subscription updated successfully',
              subscription: updatedSubscription
            });
          } else {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + durationMonths);

            const newSubscription = new UserSubscription({
              userId,
              subscriptionPlanId,
              status: 'active',
              startDate,
              endDate,
              paymentMethod,
              transactionId
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
          const { userId, subscriptionPlanId, durationMonths, transactionId } = req.body;

          if (!userId || !transactionId) {
            return res.status(400).json({ error: 'User ID and Transaction ID are required' });
          }

          const existingSubscription = await UserSubscription.findOne({ userId });

          if (!existingSubscription) {
            return res.status(404).json({ error: 'User subscription not found' });
          }

          const updateData = {
            transactionId,
            status: 'active'
          };

          if (subscriptionPlanId) {
            updateData.subscriptionPlanId = subscriptionPlanId;
          }

          if (durationMonths) {
            const baseDate = existingSubscription.endDate > new Date() 
              ? existingSubscription.endDate 
              : new Date();
            
            const newEndDate = new Date(baseDate);
            newEndDate.setMonth(newEndDate.getMonth() + durationMonths);
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
          if (error.code === 11000 && error.keyPattern?.transactionId) {
            res.status(400).json({ error: 'Transaction ID already exists' });
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