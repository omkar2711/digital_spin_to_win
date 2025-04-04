import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

interface FormData {
  fullName: string;
  contact: string;
  email: string;
}

const HomePage = () => {
  const navigate = useNavigate();
  const { setUserData } = useUser();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    contact: '',
    email: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    // Store user data in context
    setUserData({
      name: formData.fullName,
      email: formData.email,
      phone: formData.contact
    });
    // Navigate to the game page
    navigate('/game');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] relative">
      {/* Black Background Section */}
      <div className="bg-black h-[500px] absolute top-0 left-0 right-0">
        
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="top-0 left-0 right-0 z-50 px-4 py-3">
          <div className="container mx-auto">
            <img 
              src="https://assets.upgrad.com/1823/_next/static/media/upgrad-header-logo.325f003e.svg" 
              alt="upGrad Logo" 
              className="h-8"
            />
          </div>
        </header>

        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="pt-12 pb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Spin to Win<br />
              Amazing Rewards
            </h1>
            <p className="text-md md:text-lg text-gray-400 mb-6">
              Take a chance to win exclusive prizes and discounts
            </p>

            {/* Button Wrapper for Alignment */}
            <div className="relative flex justify-center">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none 
                -translate-y-4 sm:-translate-y-8
                md:-translate-y-14 md:translate-x-2
                lg:-translate-y-16 lg:translate-x-4"> 
               
              </div>

              <button 
                onClick={() => document.getElementById('challenge-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all relative z-10"
              >
                Spin & Win Now
              </button>
            </div>
          </div>

          {/* Video Section */}
          <div className="max-w-3xl mx-auto mb-16 relative z-10">
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/YpwXLyZz1O8?si=umVQxf1dYr9tFDzx" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

          {/* Spin the Wheel Section */}
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="bg-red-50 p-3 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">How to Play</h3>
                </div>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start group">
                    <span className="text-red-600 mr-3 mt-1">•</span>
                    <span className="group-hover:text-gray-900 transition-colors duration-200">Fill out the form below with your details</span>
                  </li>
                  <li className="flex items-start group">
                    <span className="text-red-600 mr-3 mt-1">•</span>
                    <span className="group-hover:text-gray-900 transition-colors duration-200">Click the "Start Challenge" button</span>
                  </li>
                  <li className="flex items-start group">
                    <span className="text-red-600 mr-3 mt-1">•</span>
                    <span className="group-hover:text-gray-900 transition-colors duration-200">Spin the wheel to win exciting prizes</span>
                  </li>
                  <li className="flex items-start group">
                    <span className="text-red-600 mr-3 mt-1">•</span>
                    <span className="group-hover:text-gray-900 transition-colors duration-200">Each spin gives you a chance to win amazing rewards</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="bg-red-50 p-3 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Prizes You Can Win</h3>
                </div>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start group">
                    <span className="text-red-600 mr-3 mt-1">•</span>
                    <span className="group-hover:text-gray-900 transition-colors duration-200">Exclusive discounts on courses</span>
                  </li>
                  <li className="flex items-start group">
                    <span className="text-red-600 mr-3 mt-1">•</span>
                    <span className="group-hover:text-gray-900 transition-colors duration-200">Free course vouchers</span>
                  </li>
                  <li className="flex items-start group">
                    <span className="text-red-600 mr-3 mt-1">•</span>
                    <span className="group-hover:text-gray-900 transition-colors duration-200">Career guidance sessions</span>
                  </li>
                  <li className="flex items-start group">
                    <span className="text-red-600 mr-3 mt-1">•</span>
                    <span className="group-hover:text-gray-900 transition-colors duration-200">Premium learning resources</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Challenge Form */}
          <div id="challenge-form" className="max-w-4xl mx-auto pb-16">
            <div className="bg-transparent border-2 border-gray-300 rounded-2xl p-8">
              <div className="mx-auto text-center mb-8 max-w-md w-full px-4">
                <div className="-mt-14 bg-[#F8F9FA]">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    Interactive Challenge
                  </h2>
                </div>
                <p className="text-gray-600 text-sm md:text-base">
                  Ready to spin and win amazing prizes?
                </p>
              </div>

              <form onSubmit={handleStartGame} className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                  <input
                    type="text"
                    placeholder="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-100 focus:border-red-500"
                  />
                  <input
                    type="tel"
                    placeholder="Contact Number"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-100 focus:border-red-500"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-100 focus:border-red-500"
                  />
                </div>
                <div className="flex justify-center">
                  <div className="-mt-6">
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all"
                    >
                      Spin & Win Now
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
