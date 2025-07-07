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
      color: '#1e293b',
      backgroundColor: 'transparent',
      '::placeholder': { color: '#64748b' }
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
            email: user.email  
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
          return_url: `${window.location.origin}/payment/complete` 
        }
      );

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
      <div className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-1">{plan.title}</h3>
        <p className="text-2xl font-bold text-slate-900">
          ${plan.price}<span className="text-sm text-slate-600">/{plan.interval}</span>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Card Details
        </label>
        <div className="bg-white p-3 rounded-lg border border-slate-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
          {error.includes('payment_intent_authentication_failure') 
            ? '3D Secure authentication required - please check your bank app'
            : error}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing || requiresAction}
          className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
            isProcessing 
              ? 'bg-blue-400 text-white cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isProcessing ? 'Processing...' : `Pay $${plan.price}`}
        </button>
      </div>

      {requiresAction && (
        <div className="text-amber-600 text-sm mt-2 bg-amber-50 p-2 rounded">
          Check your phone or bank app to complete authentication
        </div>
      )}
    </form>
  );
};

const PaymentModal = ({ plan, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Complete Your Subscription</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Plan Summary */}
        <div className="bg-slate-50 p-4 rounded-lg mb-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-2">{plan?.title}</h3>
          <p className="text-2xl font-bold text-slate-900">
            ${plan?.price}<span className="text-sm text-slate-600">/{plan?.interval}</span>
          </p>
        </div>

        {!user ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 p-3 rounded-lg mb-4">
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
      <div className="bg-white rounded-xl p-6 w-full max-w-md text-center shadow-2xl">
        <div className="mb-4">
          <svg className="w-16 h-16 text-emerald-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Subscription Successful!</h2>
        <p className="text-slate-600 mb-6">Welcome to MyLMS! You now have access to all our courses.</p>
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
      return 'bg-slate-200 text-slate-500 cursor-not-allowed';
    }
    return recommended ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-blue-600 text-white hover:bg-blue-700';
  };

  return (
    <div className={`rounded-xl p-6 flex flex-col h-full shadow-lg border transition-all duration-300 hover:shadow-xl ${
      recommended 
        ? 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 ring-2 ring-blue-500' 
        : 'bg-white border-slate-200 hover:border-slate-300'
    }`}>
      {recommended && (
        <div className="mb-4 text-center">
          <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
            MOST POPULAR
          </span>
        </div>
      )}
      
      {isSubscribed && userSubscription && (
        <div className="mb-4 text-center">
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium border border-emerald-200">
            ACTIVE
          </span>
        </div>
      )}
      
      <h3 className={`text-xl font-bold mb-2 ${recommended ? 'text-slate-900' : 'text-slate-900'}`}>{title}</h3>
      <div className="mb-4">
        <span className={`text-3xl font-bold ${recommended ? 'text-slate-900' : 'text-slate-900'}`}>${price}</span>
        <span className={`${recommended ? 'text-slate-700' : 'text-slate-600'}`}>/{interval}</span>
      </div>
      
      {isSubscribed && userSubscription && (
        <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600">
            Expires: {new Date(userSubscription.endDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-slate-600">
            Status: <span className="capitalize text-emerald-600 font-medium">{userSubscription.status}</span>
          </p>
        </div>
      )}
      
      <ul className="mb-6 flex-grow">
        <li className="flex items-center mb-2">
          <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span className={`${recommended ? 'text-slate-700' : 'text-slate-600'}`}>
            Unlimited access to all courses
          </span>
        </li>
        <li className="flex items-center mb-2">
          <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span className={`${recommended ? 'text-slate-700' : 'text-slate-600'}`}>
            24/7 customer support
          </span>
        </li>
        {interval === 'yearly' && (
          <li className="flex items-center mb-2">
            <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span className={`${recommended ? 'text-slate-700' : 'text-slate-600'}`}>
              Save 2 months with yearly billing
            </span>
          </li>
        )}
      </ul>
      
      <button 
        onClick={onSubscribe}
        disabled={isSubscribed}
        className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${getButtonStyle()}`}
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

    if (userSubscription && userSubscription.status === 'active' && new Date(userSubscription.endDate) > new Date()) {
      setError('You already have an active subscription');
      return;
    }

    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowSuccessModal(true);
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

  const isSubscribedToPlan = (planId) => {
    if (!userSubscription || !user) return false;
    
    const hasActiveSubscription = userSubscription.status === 'active' && 
                                  new Date(userSubscription.endDate) > new Date();
    
    return hasActiveSubscription && userSubscription.subscriptionPlanId?._id === planId;
  };

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <Head>
        <title>Subscriptions - MyLMS</title>
        <meta name="description" content="Choose your subscription plan for MyLMS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-slate-900">Choose Your Subscription Plan</h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Get unlimited access to our courses and learning resources with our flexible subscription options.
            </p>
            
            {user && userSubscription && userSubscription.status === 'active' && new Date(userSubscription.endDate) > new Date() && (
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg max-w-md mx-auto">
                <p className="font-medium text-emerald-800">You have an active subscription!</p>
                <p className="text-sm text-emerald-700">
                  Plan: {userSubscription.subscriptionPlanId?.title} | 
                  Expires: {new Date(userSubscription.endDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading || authLoading ? (
              <div className="col-span-3 text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-slate-600">Loading plans...</p>
              </div>
            ) : error ? (
              <div className="col-span-3 text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                {!user && (
                  <div className="mt-4">
                    <Link href="/login">
                      <span className="text-blue-600 hover:text-blue-800 cursor-pointer underline">
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
              <div className="col-span-3 text-center py-12">
                <p className="text-slate-600">No subscription plans available</p>
              </div>
            )}
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center text-slate-900">Frequently Asked Questions</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h3 className="font-bold mb-2 text-slate-900">Are there any hidden fees?</h3>
                <p className="text-slate-600">No, the price you see is the price you pay. There are no hidden fees or additional charges.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h3 className="font-bold mb-2 text-slate-900">What payment methods do you accept?</h3>
                <p className="text-slate-600">We accept all major credit cards through our secure Stripe payment system.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-4">
            <Link href="/">
              <span className="text-blue-600 font-bold text-xl cursor-pointer">MyLMS</span>
            </Link>
          </div>
          <div className="flex justify-center space-x-6 mb-6">
            <Link href="/courses">
              <span className="text-slate-600 hover:text-slate-900 cursor-pointer transition-colors">Courses</span>
            </Link>
            <Link href="/subscriptions">
              <span className="text-slate-600 hover:text-slate-900 cursor-pointer transition-colors">Subscriptions</span>
            </Link>
          </div>
          <p className="text-slate-500">© {new Date().getFullYear()} MyLMS. All rights reserved.</p>
        </div>
      </footer>

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