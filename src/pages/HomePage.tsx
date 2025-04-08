import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { toast } from "sonner";

interface FormData {
  fullName: string;
  contact: string;
  email: string;
  city: string;
  store: string;
}

// Store data
const CITY_STORE_DATA = {
  "Delhi": ["NSP Store"],
  "Mumbai": ["Vashi", "Kalyan", "Marol", "Andheri East", "Andheri West", "Thane", "Linking Rd, Bandra", 
             "Borivali", "Chembur", "Powai", "Lower Parel", "Ghatkopar West"],
  "Hyderabad": ["Somajiguda", "SR Nagar", "Himayat Nagar", "Begumpet", "Kukatpally", 
               "Chaitanyapuri", "LB Nagar", "Kondapur", "Hitech City"],
  "Bengaluru": ["Kasturi Nagar", "BTM Layout", "Malleshwaram", "Marathahalli", 
               "Coles Road", "Comm Street", "Rajaji Nagar"]
};

const HomePage = () => {
  const navigate = useNavigate();
  const { setUserData } = useUser();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    contact: '',
    email: '',
    city: '',
    store: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableStores, setAvailableStores] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // If city is changing, reset store and update available stores
    if (name === 'city') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        store: '' // Reset store when city changes
      }));
      
      // Update available stores based on selected city
      setAvailableStores(CITY_STORE_DATA[value as keyof typeof CITY_STORE_DATA] || []);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const checkPhoneNumberExists = async (phone: string) => {
    try {
      console.log('Checking if phone number exists:', phone);
      
      // Normalize the phone number by removing non-digit characters
      const normalizedPhone = phone.replace(/\D/g, '');
      console.log('Normalized phone number:', normalizedPhone);
      
      if (!normalizedPhone || normalizedPhone.length < 8) {
        console.error('Invalid phone number format');
        throw new Error('Invalid phone number format');
      }
      
      const apiUrl = `https://script.google.com/macros/s/AKfycbwILeMCeVtuLL2Acojc93bdmdUqs2LnEo3COBLIrlhc4ZlbJ5Fzxcm69C3qHJUz1PisRA/exec?phone=${encodeURIComponent(normalizedPhone)}`;
      console.log('API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-cache',
        redirect: 'follow'
      });
      
      if (!response.ok) {
        console.error('Network error response:', response.status, response.statusText);
        throw new Error('Network response was not ok');
      }

      const text = await response.text();
      console.log('Raw response:', text);
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        throw new Error('Failed to parse response');
      }
      
      console.log('Phone check response data:', data);
      
      if (typeof data.exists !== 'boolean') {
        console.error('Invalid response format, expected boolean "exists" property');
        throw new Error('Invalid response format');
      }
      
      return data.exists;
    } catch (error) {
      console.error('Error checking phone number:', error);
      throw error;
    }
  };

  const handleStartGame = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name", {
        duration: 5000,
        className: "text-lg font-medium px-4 py-3"
      });
      return;
    }

    if (!formData.contact.trim()) {
      toast.error("Please enter your contact number", {
        duration: 5000,
        className: "text-lg font-medium px-4 py-3"
      });
      return;
    }
    
    // Validate phone number format
    const phonePattern = /^[\d\s\+\-\(\)]{8,15}$/;
    if (!phonePattern.test(formData.contact)) {
      toast.error("Please enter a valid phone number", {
        duration: 5000,
        className: "text-lg font-medium px-4 py-3"
      });
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email address", {
        duration: 5000,
        className: "text-lg font-medium px-4 py-3"
      });
      return;
    }
    
    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      toast.error("Please enter a valid email address", {
        duration: 5000,
        className: "text-lg font-medium px-4 py-3"
      });
      return;
    }

    // Additional validation for city and store
    if (!formData.city) {
      toast.error("Please select your city", {
        duration: 5000,
        className: "text-lg font-medium px-4 py-3"
      });
      return;
    }

    if (!formData.store) {
      toast.error("Please select a store", {
        duration: 5000,
        className: "text-lg font-medium px-4 py-3"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if phone number already exists
      const phoneExists = await checkPhoneNumberExists(formData.contact);
      console.log('Phone exists check result:', phoneExists);
      
      if (phoneExists === true) {
        toast.error("This phone number is already registered.\nEach number can be used only once.", {
          duration: 5000,
          className: "text-lg font-medium px-4 py-3"
        });
        setIsSubmitting(false);
        return;
      }

      // Store user data in context with normalized phone and the new fields
      setUserData({
        name: formData.fullName,
        email: formData.email,
        phone: formData.contact.replace(/\D/g, ''), // Store normalized phone
        city: formData.city,
        store: formData.store
      });
      
      // Navigate to the game page
      navigate('/game');
    } catch (error) {
      console.error('Error during validation:', error);
      toast.error("Something went wrong while validating your information. Please try again later.", {
        duration: 5000,
        className: "text-lg font-medium px-4 py-3"
      });
      setIsSubmitting(false);
    }
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
                    <span className="group-hover:text-gray-900 transition-colors duration-200">Click the "Spin & Win Now" button</span>
                  </li>
                  <li className="flex items-start group">
                    <span className="text-red-600 mr-3 mt-1">•</span>
                    <span className="group-hover:text-gray-900 transition-colors duration-200">Spin the wheel to win exciting prizes</span>
                  </li>
                  {/* <li className="flex items-start group">
                    <span className="text-red-600 mr-3 mt-1">•</span>
                    <span className="group-hover:text-gray-900 transition-colors duration-200">Each spin gives you a chance to win amazing rewards</span>
                  </li> */}
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
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Contact Number"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-100 focus:border-red-500"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-100 text-gray-700 focus:border-red-500"
                    required
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-100 focus:border-red-500 bg-white appearance-none ${formData.city ? 'text-gray-700' : 'text-gray-400'}`}
                    required
                  >
                    <option value="" className="text-gray-400">Select City</option>
                    {Object.keys(CITY_STORE_DATA).map(city => (
                      <option key={city} value={city} className="text-gray-700">{city}</option>
                    ))}
                  </select>
                  
                  <select
                    name="store"
                    value={formData.store}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-100 focus:border-red-500 bg-white appearance-none ${formData.store ? 'text-gray-700' : 'text-gray-400'}`}
                    disabled={!formData.city}
                    required
                  >
                    <option value="" className="text-gray-400">Select Store</option>
                    {availableStores.map(store => (
                      <option key={store} value={store} className="text-gray-700">{store}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-center">
                  <div className="">
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Please wait...' : 'Spin & Win Now'}
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
