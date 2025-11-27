import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';

const LandingPageHeader = () => {
    return (
      <header className="py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 bg-[#1C1C1E]/80 backdrop-blur-sm z-50 text-white">
        <Link to="/" className="flex items-center gap-3">
          <img src="https://horizons-cdn.hostinger.com/8ed7485a-4b6a-443b-b3e6-74032987e468/ffaca4605e19431f4a311e93bc3b98d9.png" alt="BudgetRamp Logo" className="h-8 w-8" />
          <span className="text-xl font-bold">BudgetRamp</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/about-us" className="text-gray-300 hover:text-white transition-colors">About Us</Link>
          <Link to="/financial-management" className="text-gray-300 hover:text-white transition-colors">Financial Management</Link>
          <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
          <Link to="/resources" className="text-white font-semibold">Resources</Link>
        </nav>
        <Button asChild className="bg-purple-600 hover:bg-purple-700 rounded-full px-6">
          <Link to="/login">Launch App</Link>
        </Button>
      </header>
    );
  };

const Resources = () => {
    const handleFeatureNotImplemented = (e) => {
        e.preventDefault();
        alert("🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀");
    };

  return (
    <div className="bg-[#1C1C1E] text-white min-h-screen flex flex-col">
        <LandingPageHeader />
        <main className="flex-grow container mx-auto px-6 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-4xl md:text-6xl font-bold text-center mb-8">Resources</h1>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto text-center leading-relaxed">
                    Explore our collection of resources to deepen your financial knowledge and make the most of BudgetRamp.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-purple-400">Getting Started Guide</h3>
                        <p className="text-gray-300 mt-2">A step-by-step guide to setting up your BudgetRamp account and dashboard.</p>
                        <Button variant="link" className="text-purple-400 p-0 mt-4" onClick={handleFeatureNotImplemented}>Read more</Button>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-purple-400">API Documentation</h3>
                        <p className="text-gray-300 mt-2">Integrate BudgetRamp's power into your own applications with our robust API.</p>
                        <Button variant="link" className="text-purple-400 p-0 mt-4" onClick={handleFeatureNotImplemented}>View docs</Button>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-purple-400">Blog: Financial Insights</h3>
                        <p className="text-gray-300 mt-2">Our latest articles on personal finance, market trends, and security best practices.</p>
                        <Button variant="link" className="text-purple-400 p-0 mt-4" onClick={handleFeatureNotImplemented}>Visit blog</Button>
                    </div>
                </div>
            </motion.div>
        </main>
        <Footer />
    </div>
  );
};

export default Resources;