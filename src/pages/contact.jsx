// pages/contact.jsx
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend or a service like Formspree
    console.log('Form submitted:', formData);
    
    // Simulate form submission success
    setFormStatus('success');
    
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    // Reset status after 5 seconds
    setTimeout(() => {
      setFormStatus(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen py-20  bg-gray-900 text-white">
      <Head>
        <title>Contact Us - MyLMS</title>
        <meta name="description" content="Contact the MyLMS team" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

     

      {/* Main Content */}
      <main className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you. 
              Fill out the form below and our team will get back to you as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-800 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              
              {formStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-600 rounded-md">
                  <p>Thank you for your message! We'll get back to you soon.</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-300 mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-gray-300 mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-300 mb-2">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
            
            {/* Contact Information */}
            <div>
              <div className="bg-gray-800 p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="text-blue-500 mr-4">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Phone</h3>
                      <p className="text-gray-300">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-blue-500 mr-4">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Email</h3>
                      <p className="text-gray-300">support@mylms.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-blue-500 mr-4">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Address</h3>
                      <p className="text-gray-300">123 Learning Ave, Suite 400<br />Education City, CA 94105</p>
                    </div>
                  </div>
                </div>
              </div>
              
           
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="font-bold mb-2">How quickly will I receive a response?</h3>
                <p className="text-gray-300">We aim to respond to all inquiries within 24-48 business hours.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="font-bold mb-2">Do you offer technical support for courses?</h3>
                <p className="text-gray-300">Yes, we provide technical support for all course-related issues. Premium subscribers receive priority assistance.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="font-bold mb-2">Can I request a specific topic for future courses?</h3>
                <p className="text-gray-300">Absolutely! We welcome suggestions for new course topics. Please use the contact form to share your ideas.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 px-6 mt-12">
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