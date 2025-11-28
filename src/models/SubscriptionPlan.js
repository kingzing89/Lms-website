import mongoose from 'mongoose';

const SubscriptionPlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  interval: {
    type: String,
    enum: ['weekly', 'monthly', 'yearly'],
    required: true
  },
  isPopular: { type: Boolean, default: false },
  buttonText: { type: String, required: true },
}, {
  timestamps: true
});

export const SubscriptionPlan = mongoose.models.SubscriptionPlan || mongoose.model('SubscriptionPlan', SubscriptionPlanSchema);

export default SubscriptionPlan;