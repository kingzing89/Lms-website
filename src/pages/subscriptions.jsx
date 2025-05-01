// pages/subscriptions.jsx
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const SubscriptionCard = ({ title, price, duration, features, recommended }) => {
  return (
    <div className={`rounded-lg p-6 flex flex-col h-full ${recommended ? 'bg-blue-600' : 'bg-gray-800'}`}>
      {recommended && (
        <div className="mb-4 text-center">
          <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
            MOST POPULAR
          </span>
        </div>
      )}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">${price}</span>
        <span className="text-gray-300">/{duration}</span>
      </div>
      <ul className="mb-6 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center mb-2">
            <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <button className={`py-2 px-4 rounded-md font-medium ${recommended ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'} hover:opacity-90 transition-opacity`}>
        Subscribe Now
      </button>
    </div>
  );
};

export default function Subscriptions() {
  const subscriptionPlans = [
    {
      title: 'Monthly',
      price: '49.99',
      duration: 'month',
      features: [
        'Access to all courses',
        'Advanced learning tools',
        'Priority email support',
        '1080p video quality',
        'Course certificates',
        'Cancel anytime'
      ],
      recommended: false
    },
    {
      title: 'Yearly',
      price: '499.99',
      duration: 'year',
      features: [
        'Everything in Monthly plan',
        'Save $99.89 compared to monthly',
        'Early access to new courses',
        'Offline downloads',
        'Enhanced progress tracking'
      ],
      recommended: true
    },
    {
      title: 'Lifetime',
      price: '1499',
      duration: 'one-time',
      features: [
        'Unlimited lifetime access',
        'All features in Yearly plan',
        'Future course updates',
        'Exclusive member events',
        'Personal learning coach',
        'No recurring payments'
      ],
      recommended: false
    }
  ];

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
          </div>

          {/* Subscription Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan, index) => (
              <SubscriptionCard key={index} {...plan} />
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="font-bold mb-2">Can I cancel my subscription at any time?</h3>
                <p className="text-gray-300">Yes, you can cancel your subscription at any time. Your access will remain until the end of your billing period.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="font-bold mb-2">Are there any hidden fees?</h3>
                <p className="text-gray-300">No, the price you see is the price you pay. There are no hidden fees or additional charges.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="font-bold mb-2">Can I upgrade my plan later?</h3>
                <p className="text-gray-300">Absolutely! You can upgrade your plan at any time, and we'll prorate the difference.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="font-bold mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-300">We accept all major credit cards, PayPal, and bank transfers for yearly and lifetime plans.</p>
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
            <Link href="/contact">
              <span className="text-gray-300 hover:text-white cursor-pointer">Contact</span>
            </Link>
          </div>
          <p className="text-gray-400">© {new Date().getFullYear()} MyLMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}