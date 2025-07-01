import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: 'transparent',
      '::placeholder': { color: '#9ca3af' }
    },
    invalid: { color: '#ef4444' }
  },
  hidePostalCode: true
};

const StripePaymentForm = ({ plan, user, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [requiresAction, setRequiresAction] = useState(false);

  // Initialize payment intent with customer creation
  useEffect(() => {
    const initPayment = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: plan.price,
            planId: plan._id,
            userId: user._id,
            email: user.email  // Pass email for customer creation
          })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Payment initialization failed');
        
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError(err.message);
      }
    };

    if (plan && user) initPayment();
  }, [plan, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setIsProcessing(true);
    setError('');

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user.name,
              email: user.email
            }
          },
          return_url: `${window.location.origin}/payment/complete` // For 3D Secure
        }
      );

      // Handle authentication required (3D Secure)
      if (stripeError?.code === 'payment_intent_authentication_failure') {
        setRequiresAction(true);
        const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);
        if (confirmError) throw confirmError;
        return;
      } else if (stripeError) {
        throw stripeError;
      }

      // Handle successful payment
      if (paymentIntent?.status === 'succeeded') {
        await recordSubscription(paymentIntent);
        onSuccess();
      }
    } catch (err) {
      setError(err.message);
      console.error('Payment error:', {
        code: err.code,
        type: err.type,
        message: err.message
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const recordSubscription = async (paymentIntent) => {
    try {
      const response = await fetch('/api/user-subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          subscriptionPlanId: plan._id,
          paymentIntentId: paymentIntent.id,
          customerId: paymentIntent.customer,
          status: 'active'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to record subscription');
      }
    } catch (err) {
      console.error('Subscription recording error:', err);
      throw err;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-700 p-4 rounded-lg mb-4">
        <h3 className="font-semibold text-white mb-1">{plan.title}</h3>
        <p className="text-2xl font-bold text-white">
          ${plan.price}<span className="text-sm text-gray-300">/{plan.interval}</span>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Card Details
        </label>
        <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {error && (
        <div className="bg-red-600 text-white p-3 rounded-lg">
          {error.includes('payment_intent_authentication_failure') 
            ? '3D Secure authentication required - please check your bank app'
            : error}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing || requiresAction}
          className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
            isProcessing 
              ? 'bg-blue-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isProcessing ? 'Processing...' : `Pay $${plan.price}`}
        </button>
      </div>

      {requiresAction && (
        <div className="text-yellow-400 text-sm mt-2">
          Check your phone or bank app to complete authentication
        </div>
      )}
    </form>
  );
};



// Updated Payment Modal with Stripe Integration
const PaymentModal = ({ plan, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Complete Your Subscription</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Plan Summary */}
        <div className="bg-gray-700 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-white mb-2">{plan?.title}</h3>
          <p className="text-2xl font-bold text-white">
            ${plan?.price}<span className="text-sm text-gray-300">/{plan?.interval}</span>
          </p>
        </div>

        {!user ? (
          <div className="bg-yellow-600 text-white p-3 rounded-lg mb-4">
            Please log in to subscribe to a plan.
          </div>
        ) : (
          <Elements stripe={stripePromise}>
            <StripePaymentForm
              plan={plan}
              user={user}
              onSuccess={handleSuccess}
              onClose={onClose}
            />
          </Elements>
        )}
      </div>
    </div>
  );
};

const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md text-center">
        <div className="mb-4">
          <svg className="w-16 h-16 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Subscription Successful!</h2>
        <p className="text-gray-300 mb-6">Welcome to MyLMS! You now have access to all our courses.</p>
        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

const SubscriptionCard = ({ title, price, interval, buttonText, recommended, onSubscribe, isSubscribed, userSubscription }) => {
  const getButtonContent = () => {
    if (isSubscribed) {
      return 'Already Subscribed';
    }
    return buttonText;
  };

  const getButtonStyle = () => {
    if (isSubscribed) {
      return 'bg-gray-500 text-gray-300 cursor-not-allowed';
    }
    return recommended ? 'bg-white text-blue-600 hover:opacity-90' : 'bg-blue-600 text-white hover:opacity-90';
  };

  return (
    <div className={`rounded-lg p-6 flex flex-col h-full ${recommended ? 'bg-blue-600' : 'bg-gray-800'}`}>
      {recommended && (
        <div className="mb-4 text-center">
          <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
            MOST POPULAR
          </span>
        </div>
      )}
      
      {/* Show current subscription status */}
      {isSubscribed && userSubscription && (
        <div className="mb-4 text-center">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            ACTIVE
          </span>
        </div>
      )}
      
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">${price}</span>
        <span className="text-gray-300">/{interval}</span>
      </div>
      
      {/* Show subscription details if user is subscribed to this plan */}
      {isSubscribed && userSubscription && (
        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-300">
            Expires: {new Date(userSubscription.endDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-300">
            Status: <span className="capitalize">{userSubscription.status}</span>
          </p>
        </div>
      )}
      
      {/* Generic features based on interval */}
      <ul className="mb-6 flex-grow">
        <li className="flex items-center mb-2">
          <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Unlimited access to all courses
        </li>
        <li className="flex items-center mb-2">
          <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          24/7 customer support
        </li>
        {interval === 'yearly' && (
          <li className="flex items-center mb-2">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Save 2 months with yearly billing
          </li>
        )}
      </ul>
      
      <button 
        onClick={onSubscribe}
        disabled={isSubscribed}
        className={`py-2 px-4 rounded-md font-medium transition-opacity ${getButtonStyle()}`}
      >
        {getButtonContent()}
      </button>
    </div>
  );
};

export default function Subscriptions() {
  const { user, loading: authLoading } = useAuth();
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [userSubscription, setUserSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch subscription plans
  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch('/api/subscriptions');
        if (!res.ok) throw new Error('Failed to fetch subscription plans');
        const data = await res.json();
        setSubscriptionPlans(data);
      } catch (error) {
        console.error(error);
        setError('Failed to load subscription plans');
      }
    }

    fetchPlans();
  }, []);

  // Fetch user's current subscription
  useEffect(() => {
    async function fetchUserSubscription() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/user-subscriptions?userId=${user._id}`);
        if (res.ok) {
          const data = await res.json();
          setUserSubscription(data);
        }
      } catch (error) {
        console.error('Error fetching user subscription:', error);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchUserSubscription();
    }
  }, [user, authLoading]);

  const handleSubscribe = (plan) => {
    if (!user) {
      setError('Please log in to subscribe to a plan');
      return;
    }

    // Check if user already has an active subscription
    if (userSubscription && userSubscription.status === 'active' && new Date(userSubscription.endDate) > new Date()) {
      setError('You already have an active subscription');
      return;
    }

    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowSuccessModal(true);
    // Refresh user subscription after successful payment
    if (user) {
      fetch(`/api/user-subscriptions?userId=${user._id}`)
        .then(res => res.json())
        .then(data => setUserSubscription(data))
        .catch(console.error);
    }
  };

  const handleCloseModals = () => {
    setShowPaymentModal(false);
    setShowSuccessModal(false);
    setSelectedPlan(null);
  };

  // Check if user has active subscription for a specific plan
  const isSubscribedToPlan = (planId) => {
    if (!userSubscription || !user) return false;
    
    const hasActiveSubscription = userSubscription.status === 'active' && 
                                  new Date(userSubscription.endDate) > new Date();
    
    return hasActiveSubscription && userSubscription.subscriptionPlanId?._id === planId;
  };

  return (
    <div className="min-h-screen py-20 bg-gray-900 text-white">
      <Head>
        <title>Subscriptions - MyLMS</title>
        <meta name="description" content="Choose your subscription plan for MyLMS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Main Content */}
      <main className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Choose Your Subscription Plan</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Get unlimited access to our courses and learning resources with our flexible subscription options.
            </p>
            
            {/* Show current subscription status */}
            {user && userSubscription && userSubscription.status === 'active' && new Date(userSubscription.endDate) > new Date() && (
              <div className="mt-6 p-4 bg-green-600 rounded-lg max-w-md mx-auto">
                <p className="font-medium">You have an active subscription!</p>
                <p className="text-sm">
                  Plan: {userSubscription.subscriptionPlanId?.title} | 
                  Expires: {new Date(userSubscription.endDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Subscription Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading || authLoading ? (
              <div className="col-span-3 text-center">
                <p>Loading plans...</p>
              </div>
            ) : error ? (
              <div className="col-span-3 text-center">
                <p className="text-red-400">{error}</p>
                {!user && (
                  <div className="mt-4">
                    <Link href="/login">
                      <span className="text-blue-400 hover:text-blue-300 cursor-pointer">
                        Click here to log in
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            ) : subscriptionPlans.length > 0 ? (
              subscriptionPlans.map((plan) => {
                const isSubscribed = isSubscribedToPlan(plan._id);
                return (
                  <SubscriptionCard 
                    key={plan._id} 
                    title={plan.title}
                    price={plan.price}
                    interval={plan.interval}
                    buttonText={user ? plan.buttonText : 'Login to Subscribe'}
                    recommended={plan.isPopular}
                    isSubscribed={isSubscribed}
                    userSubscription={isSubscribed ? userSubscription : null}
                    onSubscribe={() => handleSubscribe(plan)}
                  />
                );
              })
            ) : (
              <div className="col-span-3 text-center">
                <p>No subscription plans available</p>
              </div>
            )}
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="font-bold mb-2">Are there any hidden fees?</h3>
                <p className="text-gray-300">No, the price you see is the price you pay. There are no hidden fees or additional charges.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="font-bold mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-300">We accept all major credit cards through our secure Stripe payment system.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-4">
            <Link href="/">
              <span className="text-blue-500 font-bold text-xl cursor-pointer">MyLMS</span>
            </Link>
          </div>
          <div className="flex justify-center space-x-6 mb-6">
            <Link href="/courses">
              <span className="text-gray-300 hover:text-white cursor-pointer">Courses</span>
            </Link>
            <Link href="/subscriptions">
              <span className="text-gray-300 hover:text-white cursor-pointer">Subscriptions</span>
            </Link>
          </div>
          <p className="text-gray-400">© {new Date().getFullYear()} MyLMS. All rights reserved.</p>
        </div>
      </footer>

      {/* Modals */}
      <PaymentModal
        plan={selectedPlan}
        isOpen={showPaymentModal}
        onClose={handleCloseModals}
        onSuccess={handlePaymentSuccess}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModals}
      />
    </div>
  );
}