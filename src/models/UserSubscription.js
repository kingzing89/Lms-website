// schemas/user-subscription.schema.js (SIMPLIFIED - NO CANCELLATION)
const mongoose = require('mongoose');

const UserSubscriptionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  subscriptionPlanId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SubscriptionPlan', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'expired'], 
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
    enum: ['credit_card', 'paypal', 'bank_transfer'], 
    required: true 
  },
  transactionId: { 
    type: String, 
    required: true,
    unique: true // Prevent duplicate transactions
  }
}, {
  timestamps: true
});

// Index for efficient queries
UserSubscriptionSchema.index({ userId: 1 });
UserSubscriptionSchema.index({ status: 1 });
UserSubscriptionSchema.index({ endDate: 1 });

// Virtual to check if subscription is currently active
UserSubscriptionSchema.virtual('isActive').get(function() {
  return this.status === 'active' && this.endDate > new Date();
});

// Method to check if subscription is expired and update status
UserSubscriptionSchema.methods.checkAndUpdateExpiry = function() {
  if (this.endDate < new Date() && this.status === 'active') {
    this.status = 'expired';
    return this.save();
  }
  return Promise.resolve(this);
};

// Static method to get user's current subscription (active or expired)
UserSubscriptionSchema.statics.getUserSubscription = function(userId) {
  return this.findOne({ userId }).populate('subscriptionPlanId');
};

// Static method to get user's active subscription only
UserSubscriptionSchema.statics.getActiveSubscription = function(userId) {
  return this.findOne({ 
    userId, 
    status: 'active', 
    endDate: { $gt: new Date() } 
  }).populate('subscriptionPlanId');
};

const UserSubscription = mongoose.models.UserSubscription || mongoose.model('UserSubscription', UserSubscriptionSchema);

module.exports = UserSubscription;
