import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();
  const servicesRef = useRef(null);

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const features = 
[
  {
    icon: "📦",
    title: "Smart Cargo Loading",
    description: "Our algorithm automatically calculates optimal cargo placement to maximize container space utilization while respecting stacking rules.",
    color: "from-blue-500 to-blue-400"
  },
  {
    icon: "🧊",
    title: "Fragile Item Protection",
    description: "Fragile items are clearly marked and placed in protected areas, with non-stackable items placed on top when needed.",
    color: "from-purple-500 to-purple-400"
  },
  {
    icon: "📝",
    title: "Enter Your Cargo Details",
    description: "Input cargo dimensions, weight, type, and special handling instructions easily in a guided step-by-step form.",
    color: "from-teal-500 to-teal-400"
  },
  {
    icon: "📊",
    title: "Check Cargo Availability",
    description: "Visualize your cargo loading plan in real time with our interactive 3D visualization before finalizing arrangements.",
    color: "from-orange-500 to-orange-400"
  },
  {
    icon: "💳",
    title: "Payment & Confirmation",
    description: "Review your cost summary and proceed with secure payment to confirm your shipment booking.",
    color: "from-green-500 to-green-400"
  },
  {
    icon: "🚚",
    title: "Track Your Shipment",
    description: "Monitor your shipment status from dispatch to delivery with real-time tracking and updates.",
    color: "from-red-500 to-red-400"
  }
]


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-blue-100 opacity-30 blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-blue-200 opacity-20 blur-xl"></div>
      </div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full font-medium">
              Global Logistics Solutions
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Ocean Freight <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
                Redefined
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
              Your cargo, our commitment — we simplify ocean logistics with smart, scalable solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate('/services')}
              >
                Try 3D visualisation →
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-100 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
                onClick={scrollToServices}
              >
                How It Works
              </motion.button>
            </div>
            
            <div className="flex items-center gap-4 pt-8">
              <div className="flex">
                <img 
                  src="https://png.pngtree.com/png-vector/20240819/ourlarge/pngtree-3d-person-icon-human-and-profile-illustration-logo-png-image_13542028.png" 
                  alt="Client"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              </div>

              <div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-500">Trusted by 500+ global businesses</p>
              </div>
            </div>
          </motion.div>
          
          {/* Right side image */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://plus.unsplash.com/premium_photo-1661932036915-4fd90bec6e8a?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2hpcHBpbmclMjBjb250YWluZXJ8ZW58MHx8MHx8fDA%3D"
                alt="Cargo ship at sunset"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-blue-500/20"></div>
            </div>
            
            {/* Stats card */}
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-xl border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Annual shipments</p>
                  <p className="text-2xl font-bold text-gray-800">12,480+</p>
                </div>
              </div>
            </motion.div>
            
            {/* Floating container */}
            <motion.div 
              initial={{ x: 50 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -top-8 -right-8 bg-white p-4 rounded-xl shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live tracking available</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

<div ref={servicesRef} className="min-h-screen bg-gray-50">
  {/* How It Works Section */}
  <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20 lg:px-8">
    <div className="text-center mb-12">
      <motion.h2 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-gray-900"
      >
        Container Loading Process
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto"
      >
        Our systematic approach to maximizing your container space efficiency
      </motion.p>
    </div>

    {/* Timeline-style container process - Compact version */}
    <div className="relative">
      {/* Vertical line - Made thinner */}
      <div className="absolute left-1/2 h-full w-0.5 bg-gray-200 transform -translate-x-1/2 hidden md:block"></div>
      
      {/* Process steps - Reduced spacing */}
      <div className="space-y-10 md:space-y-12">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
          >
            {/* Container box - Made more compact */}
            <div className={`w-full md:w-1/2 p-4 ${index % 2 === 0 ? 'md:pr-10' : 'md:pl-10'}`}>
              <div className="bg-white border-2 border-gray-800 rounded-lg shadow-md overflow-hidden">
                {/* Container top bar - Compact */}
                <div className="bg-gray-800 py-1 px-3 flex items-center">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-2 text-xs font-mono text-gray-300">LOAD_{index + 1}</div>
                </div>
                
                {/* Content - More compact */}
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">{feature.icon}</div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
                
                {/* Container bottom bar - Compact */}
                <div className="bg-gray-100 py-1 px-3 border-t border-gray-200 flex justify-between items-center text-xs">
                  <span className="font-mono text-gray-500">OPTIMIZED</span>
                  <span className="font-mono text-gray-500">{index + 1}/6</span>
                </div>
              </div>
            </div>
            
            {/* Timeline dot and connector - Smaller */}
            <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-white border-2 border-blue-500 items-center justify-center z-10">
              <span className="text-sm font-bold text-blue-600">{index + 1}</span>
            </div>
            
            {/* Mobile connector - Smaller */}
            <div className="md:hidden absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200 -z-10"></div>
            <div className="md:hidden absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center -mt-3">
              <span className="text-xs font-bold text-blue-600">{index + 1}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
  
        </div>
    </div>
  );
};

export default Homepage;