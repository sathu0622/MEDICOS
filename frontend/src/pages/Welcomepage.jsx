import React from 'react';
import { Link } from 'react-router-dom';
import welcomeImage from '../assets/images/welcome.jpg'; 
import WelcomeHeader from './WelcomeHeader';
import { FaUserMd, FaHandshake, FaCalendarCheck, FaShoppingCart, FaComments, FaChartLine } from 'react-icons/fa';

const Welcomepage = () => {
  return (
    <div className='min-h-screen bg-white'>
      <WelcomeHeader/>
      
      {/* Hero Section */}
      <section
        className="relative h-[600px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${welcomeImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Secure Medical Conversations
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Connect doctors and medical representatives seamlessly
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to='/Login' className="inline-block">
                <button className="w-full sm:w-auto px-8 py-3 bg-[#007bff] text-white rounded-lg font-medium hover:bg-[#0056b3] transition-colors duration-300 shadow-lg">
                  Get Started
                </button>
              </Link>
              <Link to='/Registration' className="inline-block">
                <button className="w-full sm:w-auto px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-[#007bff] transition-colors duration-300">
                  Create Account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose MEDICOS?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl text-black shadow-sm hover:shadow-md transition-shadow">
              <div className="text-[#007bff] text-3xl mb-4">
                <FaUserMd />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Doctors</h3>
              <p className="text-gray-600">Connect with qualified medical professionals</p>
            </div>
            <div className="bg-white p-6 text-black rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-[#007bff] text-3xl mb-4">
                <FaHandshake />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-gray-600">Safe and confidential medical communications</p>
            </div>
            <div className="bg-white p-6 text-black rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-[#007bff] text-3xl mb-4">
                <FaCalendarCheck />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Scheduling</h3>
              <p className="text-gray-600">Book appointments with just a few clicks</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 text-black md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Create Your Profile",
                description: "Sign up and complete your profile with relevant information",
                icon: <FaUserMd />
              },
              {
                step: 2,
                title: "Connect & Communicate",
                description: "Find and connect with medical professionals",
                icon: <FaComments />
              },
              {
                step: 3,
                title: "Schedule Meetings",
                description: "Book appointments at convenient times",
                icon: <FaCalendarCheck />
              },
              {
                step: 4,
                title: "Place Orders",
                description: "Order medical supplies and products",
                icon: <FaShoppingCart />
              },
              {
                step: 5,
                title: "Track Progress",
                description: "Monitor your orders and appointments",
                icon: <FaChartLine />
              },
              {
                step: 6,
                title: "Build Relationships",
                description: "Develop long-term professional connections",
                icon: <FaHandshake />
              }
            ].map((item) => (
              <div key={item.step} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-[#007bff] text-2xl">
                    {item.icon}
                  </div>
                  <div className="text-[#007bff] text-xl font-bold">Step {item.step}</div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-[#007bff] text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Join MEDICOS today and transform your medical communications
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to='/Registration' className="inline-block">
              <button className="w-full sm:w-auto px-8 py-3 bg-white text-[#007bff] rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300 shadow-lg">
                Sign Up Now
              </button>
            </Link>
            <Link to='/Login' className="inline-block">
              <button className="w-full sm:w-auto px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-[#007bff] transition-colors duration-300">
                Login
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Welcomepage;







// <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// {[1, 2, 3].map((step) => (
//   <div key={step} className="bg-white p-6 rounded-lg shadow-sm">
//     <div className="text-[#007bff] text-2xl font-bold mb-4">Step {step}</div>
//     <p className="text-gray-700">
//       {step === 1 && "Sign up by providing your details to get started."}
//       {step === 2 && "Fill out your profile with relevant information."}
//       {step === 3 && "Medical reps and doctors search for each other and start a conversation."}
//     </p>
//   </div>
// ))}
// </div>

// <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
// {[4, 5, 6].map((step) => (
//   <div key={step} className="bg-white p-6 rounded-lg shadow-sm">
//     <div className="text-[#007bff] text-2xl font-bold mb-4">Step {step}</div>
//     <p className="text-gray-700">
//       {step === 4 && "Agree on a time and date for a consultation or product demo."}
//       {step === 5 && "After the consultation, doctors can place orders for medicines or products."}
//       {step === 6 && "Make payment securely, and the medical rep arranges delivery or pickup."}
//     </p>
//   </div>
// ))}
// </div>