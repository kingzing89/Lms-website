// models/UserSubscription.js
import mongoose from 'mongoose';

const UserSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscriptionPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionPlan',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled', 'pending'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'stripe'],
    default: 'stripe'
  },
  // Legacy transaction ID (keep for backward compatibility)
  transactionId: {
    type: String,
    sparse: true, // Allows multiple null values
    unique: true
  },
  // New Stripe-specific fields
  paymentIntentId: {
    type: String,
    sparse: true, // Allows multiple null values
    unique: true
  },
  customerId: {
    type: String,
    sparse: true // Stripe customer ID
  },
  // Additional Stripe metadata
  stripeSubscriptionId: {
    type: String,
    sparse: true // For recurring subscriptions
  },
  lastPaymentDate: {
    type: Date
  },
  nextPaymentDate: {
    type: Date
  },
  paymentStatus: {
    type: String,
    enum: ['succeeded', 'pending', 'failed', 'requires_action'],
    default: 'succeeded'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
UserSubscriptionSchema.index({ userId: 1 });
UserSubscriptionSchema.index({ status: 1 });
UserSubscriptionSchema.index({ endDate: 1 });
UserSubscriptionSchema.index({ paymentIntentId: 1 });
UserSubscriptionSchema.index({ customerId: 1 });

// Static method to get user's active subscription
UserSubscriptionSchema.statics.getUserSubscription = async function(userId) {
  return await this.findOne({ userId })
    .populate('userId', 'name email')
    .populate('subscriptionPlanId')
    .sort({ createdAt: -1 });
};

// Method to check and update subscription expiry
UserSubscriptionSchema.methods.checkAndUpdateExpiry = async function() {
  if (this.status === 'active' && new Date() > this.endDate) {
    this.status = 'expired';
    await this.save();
  }
  return this;
};

// Method to extend subscription
UserSubscriptionSchema.methods.extend = async function(months) {
  const baseDate = this.endDate > new Date() ? this.endDate : new Date();
  const newEndDate = new Date(baseDate);
  newEndDate.setMonth(newEndDate.getMonth() + months);
  
  this.endDate = newEndDate;
  this.status = 'active';
  
  return await this.save();
};

// Method to cancel subscription
UserSubscriptionSchema.methods.cancel = async function() {
  this.status = 'cancelled';
  return await this.save();
};

// Virtual for checking if subscription is currently active
UserSubscriptionSchema.virtual('isActive').get(function() {
  return this.status === 'active' && new Date() <= this.endDate;
});

// Virtual for days remaining
UserSubscriptionSchema.virtual('daysRemaining').get(function() {
  if (this.status !== 'active') return 0;
  const now = new Date();
  const diff = this.endDate - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

// Ensure virtual fields are serialized
UserSubscriptionSchema.set('toJSON', { virtuals: true });
UserSubscriptionSchema.set('toObject', { virtuals: true });

export default mongoose.models.UserSubscription || mongoose.model('UserSubscription', UserSubscriptionSchema);