  import { useState, useEffect } from 'react';
  import Head from 'next/head';
  import Link from 'next/link';
  import { useAuth } from '../contexts/AuthContext';

  const PaymentModal = ({ plan, isOpen, onClose, onSuccess }) => {
    const { user } = useAuth();
    const [paymentData, setPaymentData] = useState({
      paymentMethod: 'credit_card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setPaymentData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const generateTransactionId = () => {
      return 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsProcessing(true);
      setError('');

      if (!user) {
        setError('Please log in to subscribe');
        setIsProcessing(false);
        return;
      }

      if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholderName) {
        setError('Please fill in all required fields');
        setIsProcessing(false);
        return;
      }

      try {
        // Use your existing API endpoint
        const response = await fetch('/api/user-subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user._id,
            subscriptionPlanId: plan._id,
            paymentMethod: paymentData.paymentMethod,
            transactionId: generateTransactionId()
          }),
        });

        const data = await response.json();

        if (response.ok) {
          onSuccess();
          onClose();
        } else {
          setError(data.error || 'Payment failed. Please try again.');
        }
      } catch (error) {
        console.error('Payment error:', error);
        setError('Payment failed. Please try again.');
      } finally {
        setIsProcessing(false);
      }
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

          {error && (
            <div className="bg-red-600 text-white p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!user && (
              <div className="bg-yellow-600 text-white p-3 rounded-lg mb-4">
                Please log in to subscribe to a plan.
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subscriber
              </label>
              <div className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300">
                {user ? `${user.name} (${user.email})` : 'Not logged in'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={paymentData.paymentMethod}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cardholder Name *
              </label>
              <input
                type="text"
                name="cardholderName"
                value={paymentData.cardholderName}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Card Number *
              </label>
              <input
                type="text"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CVV *
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="123"
                  maxLength="4"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing || !user}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : `Subscribe for $${plan?.price}`}
              </button>
            </div>
          </form>
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
                  <p className="text-gray-300">We accept all major credit cards, PayPal, and bank transfers for yearly plans.</p>
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